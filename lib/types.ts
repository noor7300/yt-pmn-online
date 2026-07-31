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

export interface ArticleStep {
  heading: string;
  body: string;
  /** A frame woven into this step. Only genuine software screenshots are
   * attached (intro/channel-page/talking-head frames are dropped during the
   * deep-article pass), and the caption describes what the screen shows in
   * plain language — never "screenshot" or a timecode. */
  image?: { file: string; caption: string };
}

export interface GeneratedArticle {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  steps: ArticleStep[];
  faq: FaqItem[];
  generatedAt: string;
  /** True once the article has been through the deep pass (richer prose +
   * curated inline images). Text-only originals leave this unset. */
  deep?: boolean;
}
