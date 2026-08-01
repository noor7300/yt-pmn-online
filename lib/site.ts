export const SITE_URL = "https://easytechtuts.shop";
export const SITE_NAME = "Easy Tech Tuts";
export const SITE_TAGLINE = "Step-by-Step Software Guides";
export const SITE_DESCRIPTION =
  "Free step-by-step tech tutorials — Shopify, QuickBooks, Power BI, Canva, Google Workspace, and hundreds of other tools.";

export const SITE_OWNER = "Impran M N";
export const SITE_EMAIL = "imp.mn007@gmail.com";

/** Safety cap on the phased indexing rollout. Indexable pages are every
 * screenshot-bearing (deep) tutorial plus, filling the remaining room, the
 * next highest-viewed tutorials overall (see getIndexableSlugs in
 * lib/data.ts) — the set only grows, it never drops a page that was already
 * indexable.
 *
 * 600 is deliberate, not round-number-for-its-own-sake: the very first
 * sitemap (before the deep pass existed) indexed the top 300 pages by view
 * count. 315 tutorials now have screenshots, and only 24 of those overlap
 * with that original 300 — so covering both sets in full takes a union of
 * 591. 600 leaves a little headroom without opening up the full 3,066-page
 * catalogue. */
export const INDEXABLE_LIMIT = 600;
