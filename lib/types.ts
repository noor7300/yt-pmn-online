export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface RawVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  durationISO: string;
  thumbnails: Partial<Record<"default" | "medium" | "high" | "standard" | "maxres", Thumbnail>>;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface CategorizedVideo extends RawVideo {
  slug: string;
  category: string;
  categoryLabel: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GeneratedArticle {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  steps: { heading: string; body: string }[];
  faq: FaqItem[];
  generatedAt: string;
}
