import type { MetadataRoute } from "next";
import { getCategories, getPublishedTutorials, isIndexable, CATEGORY_PAGE_SIZE } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  // Only the currently-indexable tutorials go in the sitemap — the rest are
  // noindex for now as part of a phased rollout (see INDEXABLE_LIMIT in lib/site.ts).
  const tutorials = getPublishedTutorials().filter(isIndexable);

  const categoryPages = categories.flatMap((c) => {
    const totalPages = Math.max(1, Math.ceil(c.count / CATEGORY_PAGE_SIZE));
    return Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;
      const url = page === 1 ? `${SITE_URL}/tutorials/${c.slug}` : `${SITE_URL}/tutorials/${c.slug}/page/${page}`;
      return { url, changeFrequency: "weekly" as const, priority: page === 1 ? 0.7 : 0.5 };
    });
  });

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...categoryPages,
    ...tutorials.map((t) => ({
      url: `${SITE_URL}/tutorials/${t.video.category}/${t.video.slug}`,
      lastModified: t.article.generatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
