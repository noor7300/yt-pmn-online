import { SITE_NAME } from "./site";
import type { PublishedTutorial } from "./data";

export function videoObjectSchema(t: PublishedTutorial) {
  const { video } = t;
  const thumb = video.thumbnails.maxres ?? video.thumbnails.high ?? video.thumbnails.medium ?? video.thumbnails.default;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: t.article.intro,
    thumbnailUrl: thumb ? [thumb.url] : [],
    uploadDate: video.publishedAt,
    duration: video.durationISO,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WatchAction",
      userInteractionCount: video.viewCount,
    },
  };
}

export function articleSchema(t: PublishedTutorial, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.article.seoTitle,
    description: t.article.metaDescription,
    datePublished: t.video.publishedAt,
    dateModified: t.article.generatedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: url,
  };
}

export function faqSchema(t: PublishedTutorial) {
  if (!t.article.faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.article.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
