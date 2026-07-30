/**
 * Pull step screenshots out of the source videos for the flagship articles.
 *
 * Frames are grabbed straight from the stream (yt-dlp resolves a direct URL,
 * ffmpeg seeks into it) so nothing large is written to disk — important here,
 * since the machine this runs on has little free space.
 *
 * Frame timing comes from the chapter timestamps in each video's own
 * description where they exist (those mark where each step actually happens);
 * videos without timestamps fall back to evenly-spaced sampling.
 *
 * Usage:
 *   npx tsx scripts/extract-screenshots.ts --limit 3        # smoke test
 *   npx tsx scripts/extract-screenshots.ts --category shopify
 *   npx tsx scripts/extract-screenshots.ts                  # all flagship
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { RawVideo, CategorizedVideo } from "../lib/types";

const exec = promisify(execFile);

const RAW_PATH = path.join(process.cwd(), "data", "raw", "videos.json");
const CAT_PATH = path.join(process.cwd(), "data", "categorized", "videos.json");
const OUT_ROOT = path.join(process.cwd(), "public", "screenshots");
const MANIFEST = path.join(process.cwd(), "data", "screenshots.json");

const FLAGSHIP_PER_CATEGORY = 5;
const CANDIDATES_PER_VIDEO = 8; // over-sample, then filter down
const KEEP_PER_VIDEO = 5;
const FRAME_WIDTH = 1280;

export interface Shot {
  file: string; // public path, e.g. /screenshots/<id>/03.webp
  atSeconds: number;
  label: string | null; // chapter title when the frame came from a timestamp
}
export type ScreenshotManifest = Record<string, Shot[]>; // keyed by video id

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (flag: string) => {
    const i = a.indexOf(flag);
    return i !== -1 ? a[i + 1] : undefined;
  };
  return {
    limit: get("--limit") ? Number(get("--limit")) : undefined,
    category: get("--category"),
    force: a.includes("--force"),
    noCrop: a.includes("--no-crop"),
  };
}

function isoToSeconds(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

/** Chapter markers like "01:23 Add the field" from the video description. */
function parseTimestamps(description: string): { at: number; label: string }[] {
  const out: { at: number; label: string }[] = [];
  for (const line of description.split("\n")) {
    const m = line.match(/^\s*(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*[-–—|)\]]?\s*(.+?)\s*$/);
    if (!m) continue;
    const at = Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]);
    const label = m[4].replace(/^[-–—|:)\]]+\s*/, "").trim();
    if (label.length >= 3 && label.length <= 90) out.push({ at, label });
  }
  return out;
}

/** Where to sample: chapter marks nudged forward (the frame right on a cut is
 * usually a transition), or evenly spaced across the middle of the video. */
function samplePoints(video: RawVideo): { at: number; label: string | null }[] {
  const duration = isoToSeconds(video.durationISO);
  const stamps = parseTimestamps(video.description).filter((s) => s.at < duration - 2);

  if (stamps.length >= 3) {
    return stamps
      .slice(0, CANDIDATES_PER_VIDEO)
      .map((s) => ({ at: Math.min(s.at + 3, duration - 2), label: s.label }));
  }

  const start = duration * 0.12;
  const end = duration * 0.9;
  const step = (end - start) / Math.max(1, CANDIDATES_PER_VIDEO - 1);
  return Array.from({ length: CANDIDATES_PER_VIDEO }, (_, i) => ({
    at: Math.round(start + i * step),
    label: null,
  }));
}

async function streamUrl(videoId: string): Promise<string> {
  // Cap height to keep the remote read light; we only need 1280px-wide stills.
  const { stdout } = await exec("yt-dlp", [
    "-f",
    "bestvideo[height<=720][ext=mp4]/best[height<=720]",
    "-g",
    "--no-warnings",
    `https://www.youtube.com/watch?v=${videoId}`,
  ]);
  const url = stdout.trim().split("\n")[0];
  if (!url.startsWith("http")) throw new Error(`no stream url for ${videoId}`);
  return url;
}

/** Fractions of frame height occupied by browser chrome (tab strip, address
 * bar, bookmarks) and the OS taskbar in these recordings. Cropping them keeps
 * the reader's eye on the app, and strips the recording machine's open tabs
 * and bookmarks out of published images. */
const CROP_TOP = 0.108;
const CROP_BOTTOM = 0.036;

async function grabFrame(url: string, at: number, dest: string, crop: boolean): Promise<void> {
  const filters = crop
    ? `crop=iw:ih*${(1 - CROP_TOP - CROP_BOTTOM).toFixed(4)}:0:ih*${CROP_TOP},scale=${FRAME_WIDTH}:-2`
    : `scale=${FRAME_WIDTH}:-2`;

  await exec(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel", "error",
      "-ss", String(at), // seek before -i so ffmpeg range-requests instead of streaming from 0
      "-i", url,
      "-frames:v", "1",
      "-vf", filters,
      "-q:v", "3",
      "-y", dest,
    ],
    { timeout: 90_000 }
  );
}

/** Mean luma + a cheap detail proxy, used to drop black frames, near-blank
 * slides, and transition blurs. */
async function frameStats(file: string): Promise<{ luma: number; detail: number }> {
  const { stderr } = await exec("ffmpeg", [
    "-hide_banner", "-loglevel", "info",
    "-i", file,
    "-vf", "signalstats,metadata=print",
    "-f", "null", "-",
  ]).catch((e: { stderr?: string }) => ({ stderr: e.stderr ?? "" }));

  const luma = Number(stderr.match(/YAVG=([\d.]+)/)?.[1] ?? 128);
  const detail = Number(stderr.match(/YDIF=([\d.]+)/)?.[1] ?? 10);
  return { luma, detail };
}

/** cwebp rather than ffmpeg — the local ffmpeg build ships without a WebP
 * encoder, and cwebp gives better compression for screenshot-style images. */
async function toWebp(src: string, dest: string): Promise<void> {
  await exec("cwebp", ["-quiet", "-q", "78", "-m", "6", src, "-o", dest]);
}

type Candidate = { at: number; label: string | null; jpg: string; luma: number; detail: number };

async function collectCandidates(
  video: RawVideo,
  outDir: string,
  points: { at: number; label: string | null }[],
  crop: boolean
): Promise<Candidate[]> {
  const url = await streamUrl(video.id);
  const candidates: Candidate[] = [];
  for (const [i, p] of points.entries()) {
    const jpg = path.join(outDir, `_cand${String(i).padStart(2, "0")}.jpg`);
    try {
      await grabFrame(url, p.at, jpg, crop);
      if (!existsSync(jpg) || (await stat(jpg)).size < 4000) continue;
      const { luma, detail } = await frameStats(jpg);
      candidates.push({ at: p.at, label: p.label, jpg, luma, detail });
    } catch {
      // a single bad seek shouldn't sink the whole video
    }
  }
  return candidates;
}

async function processVideo(video: RawVideo, crop: boolean): Promise<Shot[]> {
  const outDir = path.join(OUT_ROOT, video.id);
  await mkdir(outDir, { recursive: true });
  const points = samplePoints(video);

  // Signed stream URLs are short-lived and occasionally get throttled mid-run;
  // one retry with a freshly resolved URL clears most transient failures.
  let candidates = await collectCandidates(video, outDir, points, crop);
  if (candidates.length === 0) {
    candidates = await collectCandidates(video, outDir, points, crop);
  }

  // Drop near-black / blown-out frames, prefer the most detailed remainder,
  // then restore chronological order so the shots follow the tutorial.
  const usable = candidates.filter((c) => c.luma > 18 && c.luma < 245);
  const picked = (usable.length >= KEEP_PER_VIDEO ? usable : candidates)
    .sort((a, b) => b.detail - a.detail)
    .slice(0, KEEP_PER_VIDEO)
    .sort((a, b) => a.at - b.at);

  const shots: Shot[] = [];
  for (const [i, c] of picked.entries()) {
    const name = `${String(i + 1).padStart(2, "0")}.webp`;
    await toWebp(c.jpg, path.join(outDir, name));
    shots.push({ file: `/screenshots/${video.id}/${name}`, atSeconds: c.at, label: c.label });
  }

  // Clean up the JPEG candidates — only the WebPs ship.
  await Promise.all(
    candidates.map((c) => exec("rm", ["-f", c.jpg]).catch(() => {}))
  );

  return shots;
}

async function main() {
  const { limit, category, force, noCrop } = parseArgs();

  const raw: RawVideo[] = JSON.parse(await readFile(RAW_PATH, "utf-8"));
  const cats: CategorizedVideo[] = JSON.parse(await readFile(CAT_PATH, "utf-8"));
  const rawById = new Map(raw.map((v) => [v.id, v]));

  const byCategory = new Map<string, CategorizedVideo[]>();
  for (const v of cats) {
    if (category && v.category !== category) continue;
    const list = byCategory.get(v.category) ?? [];
    list.push(v);
    byCategory.set(v.category, list);
  }

  let flagship: CategorizedVideo[] = [];
  for (const list of byCategory.values()) {
    flagship.push(
      ...[...list]
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, FLAGSHIP_PER_CATEGORY)
    );
  }
  flagship.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  if (limit) flagship = flagship.slice(0, limit);

  console.log(`Extracting screenshots for ${flagship.length} flagship videos…`);

  const manifest: ScreenshotManifest = existsSync(MANIFEST)
    ? JSON.parse(await readFile(MANIFEST, "utf-8"))
    : {};

  let done = 0;
  let failed = 0;
  for (const v of flagship) {
    const rv = rawById.get(v.id);
    if (!rv) continue;
    if (!force && manifest[v.id]?.length) {
      done++;
      continue;
    }
    try {
      const shots = await processVideo(rv, !noCrop);
      if (shots.length) {
        manifest[v.id] = shots;
        done++;
      } else {
        failed++;
      }
      console.log(`  [${done + failed}/${flagship.length}] ${shots.length} shots — ${v.title.slice(0, 60)}`);
    } catch (err) {
      failed++;
      console.warn(`  [${done + failed}/${flagship.length}] FAILED ${v.id}: ${(err as Error).message.slice(0, 120)}`);
    }
    await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  }

  console.log(`\nDone. ${done} videos with screenshots, ${failed} failed.`);
  console.log(`Manifest: data/screenshots.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
