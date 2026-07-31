import { writeFile, mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { CategorizedVideo, GeneratedArticle } from "../lib/types";

const CATS_PATH = path.join(process.cwd(), "data", "categorized", "videos.json");
const GEN_DIR = path.join(process.cwd(), "content", "generated");
const OUT_JSON = path.join(process.cwd(), "data", "deep", "log.json");
const OUT_MD = path.join(process.cwd(), "content", "DEEP_LOG.md");
const TOTAL_FLAGSHIP = 315; // videos with extracted screenshots, per data/screenshots.json

interface LogEntry {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  url: string;
  images: number;
  words: number;
  generatedAt: string;
}

function wordCount(article: GeneratedArticle): number {
  const text = [article.intro, ...article.steps.map((s) => s.body)].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

async function main() {
  const videos: CategorizedVideo[] = JSON.parse(await readFile(CATS_PATH, "utf-8"));
  const bySlug = new Map(videos.map((v) => [v.slug, v]));
  const files = (await readdir(GEN_DIR)).filter((f) => f.endsWith(".json"));

  const entries: LogEntry[] = [];
  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    const video = bySlug.get(slug);
    if (!video) continue;
    const article: GeneratedArticle = JSON.parse(await readFile(path.join(GEN_DIR, file), "utf-8"));
    if (!article.deep) continue;
    entries.push({
      slug,
      title: video.title,
      category: video.category,
      categoryLabel: video.categoryLabel,
      url: `/tutorials/${video.category}/${slug}`,
      images: article.steps.filter((s) => s.image).length,
      words: wordCount(article),
      generatedAt: article.generatedAt,
    });
  }
  entries.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));

  await mkdir(path.dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, JSON.stringify(entries, null, 2));

  const rows = entries
    .map((e) => `| [${e.title}](${e.url}) | ${e.categoryLabel} | ${e.images} | ${e.words} | ${e.generatedAt.slice(0, 10)} |`)
    .join("\n");
  const md = `# Deep-article log (Phase 3)

${entries.length} of ${TOTAL_FLAGSHIP} flagship articles rewritten with curated inline images.
Regenerate with \`npx tsx scripts/build-deep-log.ts\`.

| Title | Category | Images | Words | Rewritten |
| --- | --- | --- | --- | --- |
${rows}
`;
  await writeFile(OUT_MD, md);

  console.log(`${entries.length}/${TOTAL_FLAGSHIP} deep articles logged.`);
  console.log(`-> ${path.relative(process.cwd(), OUT_JSON)}`);
  console.log(`-> ${path.relative(process.cwd(), OUT_MD)}`);
}

main();
