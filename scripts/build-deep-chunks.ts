import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { CategorizedVideo, GeneratedArticle } from "../lib/types";

const CHUNK_SIZE = Number(process.argv[2] ?? 8);
const CATS_PATH = path.join(process.cwd(), "data", "categorized", "videos.json");
const SHOTS_PATH = path.join(process.cwd(), "data", "screenshots.json");
const GEN_DIR = path.join(process.cwd(), "content", "generated");
const OUT_DIR = path.join(process.cwd(), "data", "deep", "chunks");

interface Shot {
  file: string;
  atSeconds: number;
  label: string | null;
}

async function main() {
  const videos: CategorizedVideo[] = JSON.parse(await readFile(CATS_PATH, "utf-8"));
  const shots: Record<string, Shot[]> = JSON.parse(await readFile(SHOTS_PATH, "utf-8"));
  const byId = new Map(videos.map((v) => [v.id, v]));

  const pending: { video: CategorizedVideo; shots: Shot[] }[] = [];
  for (const id of Object.keys(shots)) {
    const video = byId.get(id);
    if (!video) continue;
    const genPath = path.join(GEN_DIR, `${video.slug}.json`);
    if (!existsSync(genPath)) continue;
    const article: GeneratedArticle = JSON.parse(await readFile(genPath, "utf-8"));
    if (article.deep) continue;
    pending.push({ video, shots: shots[id] });
  }

  await mkdir(OUT_DIR, { recursive: true });

  const chunks: typeof pending[] = [];
  for (let i = 0; i < pending.length; i += CHUNK_SIZE) chunks.push(pending.slice(i, i + CHUNK_SIZE));

  for (let i = 0; i < chunks.length; i++) {
    const num = String(i + 1).padStart(3, "0");
    const payload = chunks[i].map(({ video, shots }) => ({
      slug: video.slug,
      title: video.title,
      description: video.description,
      category: video.category,
      categoryLabel: video.categoryLabel,
      tags: video.tags,
      shots,
    }));
    await writeFile(path.join(OUT_DIR, `chunk-${num}.json`), JSON.stringify(payload, null, 2));
  }

  console.log(`Pending: ${pending.length}. Wrote ${chunks.length} chunk(s) of up to ${CHUNK_SIZE} to data/deep/chunks/.`);
}

main();
