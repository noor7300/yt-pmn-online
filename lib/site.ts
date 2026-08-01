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
 * indexable. Currently 315 tutorials have screenshots; 400 leaves some
 * headroom for older top-viewed pages without opening up the full
 * 3,066-page catalogue. */
export const INDEXABLE_LIMIT = 400;
