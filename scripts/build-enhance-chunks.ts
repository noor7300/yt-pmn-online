/**
 * Split the articles still awaiting the enhancement pass into work chunks.
 *
 * Pending == deep, visible, and carrying no `verifiedNote`. That field is the
 * marker the pass always writes, so progress is read from the articles
 * themselves and a re-run after a crashed batch picks up exactly what is left.
 *
 * Highest view count first, so if the run is interrupted the pages that were
 * already earning traffic are the ones that got improved.
 *
 * Usage:
 *   npx tsx scripts/build-enhance-chunks.ts [chunkSize]
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { getVisibleTutorials } from "../lib/data";

const OUT_DIR = path.join(process.cwd(), "data", "enhance", "chunks");

async function main() {
  const size = Number(process.argv[2] ?? 5);

  const pending = getVisibleTutorials()
    .filter((t) => t.article.deep && !t.article.verifiedNote)
    .sort((a, b) => b.video.viewCount - a.video.viewCount)
    .map((t) => ({
      slug: t.video.slug,
      title: t.video.title,
      category: t.video.category,
      categoryLabel: t.video.categoryLabel,
      views: t.video.viewCount,
      steps: t.article.steps.length,
      faq: t.article.faq.length,
    }));

  if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const chunks: typeof pending[] = [];
  for (let i = 0; i < pending.length; i += size) chunks.push(pending.slice(i, i + size));

  for (const [i, chunk] of chunks.entries()) {
    const name = `chunk-${String(i + 1).padStart(3, "0")}.json`;
    await writeFile(path.join(OUT_DIR, name), JSON.stringify(chunk, null, 2));
  }

  const done = getVisibleTutorials().filter((t) => t.article.verifiedNote).length;
  console.log(`Enhanced so far: ${done}. Pending: ${pending.length}.`);
  console.log(`Wrote ${chunks.length} chunk(s) of up to ${size} to data/enhance/chunks/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
