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

/** One concrete way the task fails, and what to do about it. Only worth
 * recording where the failure is real and specific — a generic "check your
 * internet connection" entry is padding. */
export interface TroubleshootingItem {
  /** What the reader sees go wrong, in their words. */
  problem: string;
  /** Why it happens. */
  cause: string;
  /** What to do about it. */
  fix: string;
}

/** A source that can be checked independently — vendor documentation, a
 * pricing page, a changelog. Never a link invented to look authoritative. */
export interface Reference {
  label: string;
  url: string;
}

/** A comparison or reference table. Worth adding only where the information
 * is genuinely tabular — plan tiers against features, formats against size
 * limits, one tool against another. Prose reformatted into two columns is
 * not a table and reads worse than the paragraph it came from. */
export interface ArticleTable {
  /** Rendered as the table's caption, e.g. "Supported formats". */
  title: string;
  columns: string[];
  /** Each row must have exactly `columns.length` cells. */
  rows: string[][];
  /** Optional line under the table — a caveat, or where the figures came
   * from when they are the kind that go stale. */
  note?: string;
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

  /* ---------------------------------------------------------------------
   * Everything below is optional on purpose.
   *
   * The original schema allowed exactly one article shape — intro, steps,
   * FAQ — so 95% of pages ended up with 6-7 steps and 90% with exactly five
   * FAQs. That uniformity reads as machine-produced no matter how good the
   * prose is. These fields exist so an article can carry what its subject
   * actually warrants and omit the rest; filling all of them in on every
   * page would just build a longer template and defeat the point.
   * ------------------------------------------------------------------- */

  /** What the reader must already have before step 1 is possible. Omit when
   * the task genuinely has no preconditions. */
  prerequisites?: string[];

  /** Real failure modes for this specific task. Omit when the task has no
   * meaningful way to go wrong. */
  troubleshooting?: TroubleshootingItem[];

  /** Whether the task needs a paid plan or costs money, when that is a real
   * question for this feature. Omit when cost is irrelevant. */
  costNote?: string;

  /** Reference or comparison tables. Most articles warrant none. */
  tables?: ArticleTable[];

  /** Official documentation and other checkable sources. */
  references?: Reference[];

  /** When the steps were last checked, and against what. Kept as free text
   * so it can state precisely what was verified rather than implying a
   * hands-on retest that did not happen. */
  verifiedNote?: string;
}
