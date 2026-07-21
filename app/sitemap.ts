import type { MetadataRoute } from "next";
import { getCategories, getPublishedTutorials } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  const tutorials = getPublishedTutorials();

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/tutorials/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tutorials.map((t) => ({
      url: `${SITE_URL}/tutorials/${t.video.category}/${t.video.slug}`,
      lastModified: t.article.generatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
