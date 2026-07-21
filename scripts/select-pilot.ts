import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { CategorizedVideo } from "../lib/types";

const PILOT_SIZE = Number(process.argv[2] ?? 100);
const IN_PATH = path.join(process.cwd(), "data", "categorized", "videos.json");
const OUT_DIR = path.join(process.cwd(), "data", "pilot");

async function main() {
  const videos: CategorizedVideo[] = JSON.parse(await readFile(IN_PATH, "utf-8"));
  const pilot = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, PILOT_SIZE);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, "pilot-videos.json"), JSON.stringify(pilot, null, 2));

  const byCategory: Record<string, number> = {};
  for (const v of pilot) byCategory[v.categoryLabel] = (byCategory[v.categoryLabel] ?? 0) + 1;

  console.log(`Selected ${pilot.length} pilot videos (highest view count).`);
  console.log("Category spread:");
  for (const [k, v] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${v.toString().padStart(3)}  ${k}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
