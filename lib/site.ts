export const SITE_URL = "https://easytechtuts.shop";
export const SITE_NAME = "Easy Tech Tuts";
export const SITE_TAGLINE = "Tech Tutorials by PMN Online";
export const SITE_DESCRIPTION =
  "Free step-by-step tech tutorials — Shopify, QuickBooks, Power BI, Canva, Google Workspace, and hundreds of other tools — brought to you by PMN Online.";

/** Phased indexing rollout: only the top N tutorials by view count are
 * marked indexable (and included in the sitemap) at any given time. Raise
 * this gradually as Search Console shows healthy indexing with no issues —
 * see data/full/dispatch-progress.txt for the rollout log. */
export const INDEXABLE_LIMIT = 300;
