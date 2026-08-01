/**
 * Locks the current set of indexable slugs into the permanent history file.
 *
 * data/indexable-history.json is the floor for lib/data.ts's isIndexable():
 * once a slug lands in that file, it is indexable forever, regardless of
 * how the "current qualifying set" logic changes later (view counts get
 * refreshed, INDEXABLE_LIMIT changes, selection criteria change, etc.).
 * This script only ever adds to that file — run it after adding new deep
 * articles (or any time the qualifying logic changes) so newly-qualified
 * pages get locked in too, then commit the result.
 *
 * Usage: npx tsx scripts/sync-indexable-history.ts
 */
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { getPublishedTutorials, getScreenshots } from "../lib/data";
import { INDEXABLE_LIMIT } from "../lib/site";

const HISTORY_PATH = path.join(process.cwd(), "data", "indexable-history.json");

async function main() {
  const existing: string[] = existsSync(HISTORY_PATH) ? JSON.parse(await readFile(HISTORY_PATH, "utf-8")) : [];
  const historySet = new Set(existing);
  const before = historySet.size;

  // Same "current qualifying set" logic as getIndexableSlugs() in lib/data.ts:
  // every deep/screenshot-bearing tutorial, plus the next highest-viewed
  // tutorials up to INDEXABLE_LIMIT.
  const all = getPublishedTutorials();
  for (const t of all) {
    if (getScreenshots(t.video.id).length > 0) historySet.add(t.video.slug);
  }
  for (const t of all) {
    if (historySet.size >= INDEXABLE_LIMIT) break;
    historySet.add(t.video.slug);
  }

  const merged = [...historySet].sort();
  await mkdir(path.dirname(HISTORY_PATH), { recursive: true });
  await writeFile(HISTORY_PATH, JSON.stringify(merged, null, 2) + "\n");

  console.log(`History: ${before} -> ${merged.length} slugs (+${merged.length - before} newly locked in).`);
  console.log(`-> ${path.relative(process.cwd(), HISTORY_PATH)}`);
}

main();
