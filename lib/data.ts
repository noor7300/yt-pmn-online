import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { CategorizedVideo, GeneratedArticle } from "./types";
import { TAXONOMY } from "./taxonomy";

const CATEGORIZED_PATH = path.join(process.cwd(), "data", "categorized", "videos.json");
const GENERATED_DIR = path.join(process.cwd(), "content", "generated");

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

export function getTutorialsByCategory(categorySlug: string): PublishedTutorial[] {
  return getPublishedTutorials().filter((t) => t.video.category === categorySlug);
}

export const CATEGORY_PAGE_SIZE = 24;

export interface PagedTutorials {
  items: PublishedTutorial[];
  currentPage: number;
  totalPages: number;
}

export function getTutorialsByCategoryPaged(categorySlug: string, page: number): PagedTutorials {
  const all = getTutorialsByCategory(categorySlug);
  const totalPages = Math.max(1, Math.ceil(all.length / CATEGORY_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * CATEGORY_PAGE_SIZE;
  return { items: all.slice(start, start + CATEGORY_PAGE_SIZE), currentPage, totalPages };
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
