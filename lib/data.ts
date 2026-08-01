import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { CategorizedVideo, GeneratedArticle } from "./types";
import { TAXONOMY } from "./taxonomy";
import { INDEXABLE_LIMIT } from "./site";
import { articleWordCount } from "./format";

const CATEGORIZED_PATH = path.join(process.cwd(), "data", "categorized", "videos.json");
const GENERATED_DIR = path.join(process.cwd(), "content", "generated");
const SCREENSHOTS_PATH = path.join(process.cwd(), "data", "screenshots.json");
const INDEXABLE_HISTORY_PATH = path.join(process.cwd(), "data", "indexable-history.json");

export interface Screenshot {
  file: string;
  atSeconds: number;
  /** Chapter title from the video's description, when it had timestamps. */
  label: string | null;
}

let _screenshots: Record<string, Screenshot[]> | null = null;
function screenshotManifest(): Record<string, Screenshot[]> {
  if (!_screenshots) {
    _screenshots = existsSync(SCREENSHOTS_PATH)
      ? JSON.parse(readFileSync(SCREENSHOTS_PATH, "utf-8"))
      : {};
  }
  return _screenshots!;
}

export function getScreenshots(videoId: string): Screenshot[] {
  return screenshotManifest()[videoId] ?? [];
}

export interface PublishedTutorial {
  video: CategorizedVideo;
  article: GeneratedArticle;
}

export interface CategorySummary {
  slug: string;
  label: string;
  groupSlug: string;
  groupLabel: string;
  count: number;
}

let _allCategorized: CategorizedVideo[] | null = null;
function allCategorized(): CategorizedVideo[] {
  if (!_allCategorized) {
    _allCategorized = JSON.parse(readFileSync(CATEGORIZED_PATH, "utf-8"));
  }
  return _allCategorized!;
}

let _published: PublishedTutorial[] | null = null;

/** Every video that has both a categorized metadata record and a generated
 * article on disk. This is the live/published set — as more files land in
 * content/generated/, more pages appear on the next build, no code changes. */
export function getPublishedTutorials(): PublishedTutorial[] {
  if (_published) return _published;

  const videos = allCategorized();
  const bySlug = new Map(videos.map((v) => [v.slug, v]));
  const files = existsSync(GENERATED_DIR)
    ? readdirSync(GENERATED_DIR).filter((f) => f.endsWith(".json"))
    : [];

  const out: PublishedTutorial[] = [];
  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    const video = bySlug.get(slug);
    if (!video) continue;
    const article: GeneratedArticle = JSON.parse(readFileSync(path.join(GENERATED_DIR, file), "utf-8"));
    out.push({ video, article });
  }
  out.sort((a, b) => b.video.viewCount - a.video.viewCount);
  _published = out;
  return out;
}

export function getTutorialBySlug(slug: string): PublishedTutorial | null {
  return getPublishedTutorials().find((t) => t.video.slug === slug) ?? null;
}

let _indexableSlugs: Set<string> | null = null;

/** HARD RULE: a URL that has ever been indexable must stay indexable,
 * forever. A page dropping out of the sitemap after Google has indexed it
 * is a real, avoidable SEO cost — it already happened once (see git history
 * around July 30, when switching the qualifying rule silently dropped 276
 * pages) and must never happen again, even accidentally.
 *
 * data/indexable-history.json is the enforcement mechanism: a committed,
 * append-only file that is the *floor* for this function, independent of
 * whatever the "current qualifying set" logic below computes. Even if a
 * future change to that logic (different criteria, view counts refreshed,
 * INDEXABLE_LIMIT lowered, a bug) would otherwise shrink the set, the
 * history file guarantees every previously-locked-in slug stays indexable.
 *
 * This function unions that history with the current qualifying set (every
 * screenshot-bearing/deep article, plus the next highest-viewed tutorials up
 * to INDEXABLE_LIMIT) so newly-qualifying pages are indexable immediately —
 * but the history file itself only gets updated by deliberately running
 * `npx tsx scripts/sync-indexable-history.ts` and committing the result,
 * which is what actually locks new pages in permanently. Never edit or
 * regenerate that file any other way, and never remove entries from it. */
function getIndexableSlugs(): Set<string> {
  if (!_indexableSlugs) {
    const history: string[] = existsSync(INDEXABLE_HISTORY_PATH)
      ? JSON.parse(readFileSync(INDEXABLE_HISTORY_PATH, "utf-8"))
      : [];
    const slugs = new Set(history);

    const all = getPublishedTutorials(); // already sorted by view count, descending
    for (const t of all) {
      if (getScreenshots(t.video.id).length > 0) slugs.add(t.video.slug);
    }
    for (const t of all) {
      if (slugs.size >= INDEXABLE_LIMIT) break;
      slugs.add(t.video.slug);
    }
    _indexableSlugs = slugs;
  }
  return _indexableSlugs;
}

export function isIndexable(tutorial: PublishedTutorial): boolean {
  return getIndexableSlugs().has(tutorial.video.slug);
}

export function getCategories(): CategorySummary[] {
  const tutorials = getPublishedTutorials();
  const map = new Map<string, CategorySummary>();

  for (const t of tutorials) {
    const key = t.video.category;
    if (!map.has(key)) {
      const tax = TAXONOMY.find((x) => x.slug === key);
      map.set(key, {
        slug: key,
        label: t.video.categoryLabel,
        groupSlug: tax?.groupSlug ?? "other",
        groupLabel: tax?.groupLabel ?? "Other",
        count: 0,
      });
    }
    map.get(key)!.count += 1;
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getCategory(slug: string): CategorySummary | null {
  return getCategories().find((c) => c.slug === slug) ?? null;
}

/** Category listing order, view-count descending — used for "related" picks. */
export function getTutorialsByCategory(categorySlug: string): PublishedTutorial[] {
  return getPublishedTutorials().filter((t) => t.video.category === categorySlug);
}

/** Newest first, by the video's real YouTube publish date. This is the order
 * the category pages and the homepage "latest" strip read in. */
export function getTutorialsByCategoryNewest(categorySlug: string): PublishedTutorial[] {
  return [...getTutorialsByCategory(categorySlug)].sort((a, b) =>
    b.video.publishedAt.localeCompare(a.video.publishedAt)
  );
}

let _newest: PublishedTutorial[] | null = null;
export function getNewestTutorials(limit?: number): PublishedTutorial[] {
  if (!_newest) {
    _newest = [...getPublishedTutorials()].sort((a, b) =>
      b.video.publishedAt.localeCompare(a.video.publishedAt)
    );
  }
  return limit ? _newest.slice(0, limit) : _newest;
}

export const CATEGORY_PAGE_SIZE = 5;

export interface PagedTutorials {
  items: PublishedTutorial[];
  currentPage: number;
  totalPages: number;
}

export function getTutorialsByCategoryPaged(categorySlug: string, page: number): PagedTutorials {
  const all = getTutorialsByCategoryNewest(categorySlug);
  const totalPages = Math.max(1, Math.ceil(all.length / CATEGORY_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * CATEGORY_PAGE_SIZE;
  return { items: all.slice(start, start + CATEGORY_PAGE_SIZE), currentPage, totalPages };
}

/** Tutorials that have been through the Phase 3 deep-article pass (richer
 * prose + curated inline images from real extracted frames). This is the
 * authoritative source for "deep" status — it reads the same `deep` flag
 * the page template checks, so it can never drift from what's actually
 * live. Use this to feature these guides on the homepage or elsewhere. */
export function getDeepTutorials(): PublishedTutorial[] {
  return getPublishedTutorials()
    .filter((t) => t.article.deep)
    .sort((a, b) => b.article.generatedAt.localeCompare(a.article.generatedAt));
}

/** Deep tutorials that actually kept at least one real inline screenshot —
 * a handful of deep articles ended up with zero usable frames (every
 * candidate was junk) and fall back to the YouTube thumbnail on their own
 * page, which is fine there but wrong for a section explicitly featuring
 * "real screenshot" guides. */
function withInlineImage(tutorials: PublishedTutorial[]): PublishedTutorial[] {
  return tutorials.filter((t) => t.article.steps.some((s) => s.image));
}

/** Homepage "Featured — Start here" picks: the deep-rewritten, real-screenshot
 * guides with the most real viewer demand, highest view count first. */
export function getFeaturedTutorials(limit = 4, excludeIds: Set<string> = new Set()): PublishedTutorial[] {
  return withInlineImage(getDeepTutorials())
    .filter((t) => !excludeIds.has(t.video.id))
    .sort((a, b) => b.video.viewCount - a.video.viewCount)
    .slice(0, limit);
}

/** Homepage "Featured guides — Deep dives worth your time" picks: the
 * longest, most thorough deep-rewritten guides with real screenshots,
 * excluding anything already used in the "Start here" picks so the two
 * sections don't repeat. */
export function getDeepDiveGuides(limit = 2, excludeIds: Set<string> = new Set()): PublishedTutorial[] {
  return withInlineImage(getDeepTutorials())
    .filter((t) => !excludeIds.has(t.video.id))
    .sort((a, b) => articleWordCount(b.article) - articleWordCount(a.article))
    .slice(0, limit);
}

export const HOME_PAGE_SIZE = 7;

/** Paginated view over every deep-rewritten guide, newest-rewritten first —
 * the homepage's "Recently updated guides" feed. */
export function getDeepTutorialsPaged(page: number): PagedTutorials {
  const all = getDeepTutorials();
  const totalPages = Math.max(1, Math.ceil(all.length / HOME_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * HOME_PAGE_SIZE;
  return { items: all.slice(start, start + HOME_PAGE_SIZE), currentPage, totalPages };
}

export function getRelatedTutorials(current: PublishedTutorial, limit = 4): PublishedTutorial[] {
  return getTutorialsByCategory(current.video.category)
    .filter((t) => t.video.slug !== current.video.slug)
    .slice(0, limit);
}

export function getGroups(): { slug: string; label: string; categories: CategorySummary[] }[] {
  const categories = getCategories();
  const groups = new Map<string, { slug: string; label: string; categories: CategorySummary[] }>();
  for (const c of categories) {
    if (!groups.has(c.groupSlug)) groups.set(c.groupSlug, { slug: c.groupSlug, label: c.groupLabel, categories: [] });
    groups.get(c.groupSlug)!.categories.push(c);
  }
  return [...groups.values()].sort(
    (a, b) => b.categories.reduce((s, c) => s + c.count, 0) - a.categories.reduce((s, c) => s + c.count, 0)
  );
}
