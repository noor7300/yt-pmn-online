export const SITE_URL = "https://easytechtuts.shop";
export const SITE_NAME = "Easy Tech Tuts";
export const SITE_TAGLINE = "Step-by-Step Software Guides";
export const SITE_DESCRIPTION =
  "Free step-by-step tech tutorials — Shopify, QuickBooks, Power BI, Canva, Google Workspace, and hundreds of other tools.";

export const SITE_OWNER = "Impran M N";
export const SITE_EMAIL = "imp.mn007@gmail.com";

/** Phased indexing rollout: only the top N tutorials by view count are
 * marked indexable (and included in the sitemap) at any given time. Raise
 * this gradually as Search Console shows healthy indexing with no issues —
 * see data/full/dispatch-progress.txt for the rollout log. */
export const INDEXABLE_LIMIT = 300;
