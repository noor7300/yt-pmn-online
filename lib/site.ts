export const SITE_URL = "https://easytechtuts.shop";
export const SITE_NAME = "Easy Tech Tuts";
export const SITE_TAGLINE = "Step-by-Step Software Guides";
export const SITE_DESCRIPTION =
  "Free step-by-step tech tutorials — Shopify, QuickBooks, Power BI, Canva, Google Workspace, and hundreds of other tools.";

export const SITE_OWNER = "Impran M N";
export const SITE_EMAIL = "imp.mn007@gmail.com";

/** Safety cap on the phased indexing rollout. Indexable pages are the ones
 * carrying step screenshots (see getIndexableSlugs in lib/data.ts); this cap
 * just stops that set from growing without a deliberate decision. Currently
 * 315 tutorials have screenshots, so 400 leaves headroom without opening up
 * the full 3,066-page catalogue. */
export const INDEXABLE_LIMIT = 400;
