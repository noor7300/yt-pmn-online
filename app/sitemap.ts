import type { MetadataRoute } from "next";
import { getCategories, getPublishedTutorials, isIndexable } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  // Only the currently-indexable tutorials go in the sitemap — the rest are
  // noindex for now as part of a phased rollout (see INDEXABLE_LIMIT in lib/site.ts).
  const tutorials = getPublishedTutorials().filter(isIndexable);

  // Page 1 only. Deeper pagination pages stay crawlable via the numbered links
  // on each category page, but listing them here would bury the actual articles
  // under several hundred thin listing URLs.
  const categoryPages = categories.map((c) => ({
    url: `${SITE_URL}/tutorials/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticPages = ["/about", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...staticPages,
    ...categoryPages,
    ...tutorials.map((t) => ({
      url: `${SITE_URL}/tutorials/${t.video.category}/${t.video.slug}`,
      lastModified: t.article.generatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
