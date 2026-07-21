import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { TAXONOMY } from "../lib/taxonomy";
import type { RawVideo, CategorizedVideo } from "../lib/types";

const RAW_PATH = path.join(process.cwd(), "data", "raw", "videos.json");
const OUT_DIR = path.join(process.cwd(), "data", "categorized");

function slugify(title: string): string {
  // Titles follow "How to X | subtitle | Easily 2026" — the part before the
  // first "|" is the actual descriptive phrase; drop trailing brand/year noise.
  const main = title.split("|")[0];
  return main
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function findCategory(video: RawVideo): { slug: string; label: string; groupSlug: string; groupLabel: string } | null {
  const haystack = `${video.title} ${video.tags.join(" ")}`.toLowerCase();

  let best: { index: number; keywordLen: number; entry: (typeof TAXONOMY)[number] } | null = null;

  for (const entry of TAXONOMY) {
    for (const kw of entry.keywords) {
      const idx = haystack.indexOf(kw.toLowerCase());
      if (idx === -1) continue;
      if (
        !best ||
        idx < best.index ||
        (idx === best.index && kw.length > best.keywordLen)
      ) {
        best = { index: idx, keywordLen: kw.length, entry };
      }
    }
  }

  if (!best) return null;
  return {
    slug: best.entry.slug,
    label: best.entry.label,
    groupSlug: best.entry.groupSlug,
    groupLabel: best.entry.groupLabel,
  };
}

async function main() {
  const raw: RawVideo[] = JSON.parse(await readFile(RAW_PATH, "utf-8"));

  const categorized: CategorizedVideo[] = [];
  const needsReview: RawVideo[] = [];
  const slugCounts = new Map<string, number>();

  for (const video of raw) {
    const match = findCategory(video);

    let slug = slugify(video.title);
    const seen = slugCounts.get(slug) ?? 0;
    slugCounts.set(slug, seen + 1);
    if (seen > 0) slug = `${slug}-${video.id.slice(0, 6)}`;

    if (!match) {
      needsReview.push(video);
      continue;
    }

    categorized.push({
      ...video,
      slug,
      category: match.slug,
      categoryLabel: match.label,
    });
  }

  const categoryCounts: Record<string, { label: string; groupSlug: string; groupLabel: string; count: number }> = {};
  for (const v of categorized) {
    const entry = TAXONOMY.find((t) => t.slug === v.category)!;
    if (!categoryCounts[v.category]) {
      categoryCounts[v.category] = { label: entry.label, groupSlug: entry.groupSlug, groupLabel: entry.groupLabel, count: 0 };
    }
    categoryCounts[v.category].count += 1;
  }

  const sortedCounts = Object.entries(categoryCounts)
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.count - a.count);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, "videos.json"), JSON.stringify(categorized, null, 2));
  await writeFile(
    path.join(OUT_DIR, "category-counts.json"),
    JSON.stringify(
      {
        totalCategorized: categorized.length,
        totalNeedsReview: needsReview.length,
        categories: sortedCounts,
      },
      null,
      2
    )
  );
  await writeFile(
    path.join(OUT_DIR, "needs-review.json"),
    JSON.stringify(
      needsReview.map((v) => ({ id: v.id, title: v.title })),
      null,
      2
    )
  );

  console.log(`Categorized: ${categorized.length}`);
  console.log(`Needs review: ${needsReview.length}`);
  console.log(`Categories found: ${sortedCounts.length}`);
  console.log("\nTop 20 categories:");
  for (const c of sortedCounts.slice(0, 20)) {
    console.log(`  ${c.count.toString().padStart(4)}  ${c.label} (${c.groupLabel})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
