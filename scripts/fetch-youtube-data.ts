import { config } from "dotenv";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { RawVideo } from "../lib/types";

config({ path: ".env.local", quiet: true });

const API_KEY = process.env.YOUTUBE_API_KEY;
const HANDLE = (process.env.YOUTUBE_CHANNEL_HANDLE || "@PMNOnline").replace(/^@/, "");
const API_BASE = "https://www.googleapis.com/youtube/v3";
const OUT_DIR = path.join(process.cwd(), "data", "raw");

if (!API_KEY) {
  console.error("Missing YOUTUBE_API_KEY in .env.local. Copy .env.local.example and fill it in.");
  process.exit(1);
}

async function getJson<T>(url: string, params: Record<string, string>): Promise<T> {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set("key", API_KEY!);

  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(u.toString());
    if (res.ok) return res.json() as Promise<T>;
    const body = await res.text();
    if (attempt === 3) throw new Error(`YouTube API error ${res.status}: ${body}`);
    console.warn(`Request failed (attempt ${attempt}), retrying...`, res.status);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
  throw new Error("unreachable");
}

interface ChannelsResponse {
  items?: { id: string; contentDetails: { relatedPlaylists: { uploads: string } } }[];
}

interface PlaylistItemsResponse {
  items?: { contentDetails?: { videoId?: string } }[];
  nextPageToken?: string;
}

interface VideosResponse {
  items?: {
    id: string;
    snippet: {
      title: string;
      description?: string;
      publishedAt: string;
      tags?: string[];
      thumbnails?: RawVideo["thumbnails"];
    };
    contentDetails: { duration: string };
    statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
  }[];
}

async function resolveUploadsPlaylistId(): Promise<{ channelId: string; uploadsPlaylistId: string }> {
  const data = await getJson<ChannelsResponse>(`${API_BASE}/channels`, {
    part: "contentDetails,snippet",
    forHandle: HANDLE,
  });
  const channel = data.items?.[0];
  if (!channel) throw new Error(`Could not resolve channel for handle @${HANDLE}`);
  return {
    channelId: channel.id,
    uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
  };
}

async function fetchAllVideoIds(uploadsPlaylistId: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  let page = 0;

  do {
    const data = await getJson<PlaylistItemsResponse>(`${API_BASE}/playlistItems`, {
      part: "contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    for (const item of data.items ?? []) {
      if (item.contentDetails?.videoId) ids.push(item.contentDetails.videoId);
    }
    pageToken = data.nextPageToken;
    page += 1;
    console.log(`  playlistItems page ${page}: ${ids.length} video ids so far`);
  } while (pageToken);

  return ids;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function fetchVideoDetails(ids: string[]): Promise<RawVideo[]> {
  const out: RawVideo[] = [];
  const batches = chunk(ids, 50);

  for (const [i, batch] of batches.entries()) {
    const data = await getJson<VideosResponse>(`${API_BASE}/videos`, {
      part: "snippet,contentDetails,statistics",
      id: batch.join(","),
    });
    for (const item of data.items ?? []) {
      out.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description ?? "",
        publishedAt: item.snippet.publishedAt,
        tags: item.snippet.tags ?? [],
        durationISO: item.contentDetails.duration,
        thumbnails: item.snippet.thumbnails ?? {},
        viewCount: Number(item.statistics?.viewCount ?? 0),
        likeCount: Number(item.statistics?.likeCount ?? 0),
        commentCount: Number(item.statistics?.commentCount ?? 0),
      });
    }
    console.log(`  videos batch ${i + 1}/${batches.length}: ${out.length} videos fetched so far`);
  }

  return out;
}

async function main() {
  console.log(`Resolving channel @${HANDLE}...`);
  const { channelId, uploadsPlaylistId } = await resolveUploadsPlaylistId();
  console.log(`Channel ID: ${channelId}, uploads playlist: ${uploadsPlaylistId}`);

  console.log("Fetching all video ids from uploads playlist...");
  const ids = await fetchAllVideoIds(uploadsPlaylistId);
  console.log(`Found ${ids.length} videos.`);

  console.log("Fetching video details in batches of 50...");
  const videos = await fetchVideoDetails(ids);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, "videos.json"), JSON.stringify(videos, null, 2));
  await writeFile(
    path.join(OUT_DIR, "meta.json"),
    JSON.stringify({ channelId, uploadsPlaylistId, fetchedAt: new Date().toISOString(), count: videos.length }, null, 2)
  );

  console.log(`Done. Wrote ${videos.length} videos to data/raw/videos.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
