// The apex domain 308-redirects to www (configured in Vercel's domain
// settings, not in this codebase) — www is the actual canonical host. Every
// URL this site generates (sitemap, canonical tags, JSON-LD, OG, robots.txt)
// must point straight at it; pointing at the apex would mean every crawl
// costs an extra redirect hop instead of a direct 200.
export const SITE_URL = "https://www.easytechtuts.shop";
export const SITE_NAME = "Easy Tech Tuts";
export const SITE_TAGLINE = "Step-by-Step Software Guides";
export const SITE_DESCRIPTION =
  "Free step-by-step tech tutorials — Shopify, QuickBooks, Power BI, Canva, Google Workspace, and hundreds of other tools.";

export const SITE_OWNER = "Impran M N";
export const SITE_EMAIL = "imp.mn007@gmail.com";

/** Bio shown in the author box under every tutorial. This is the main thing
 * telling a reader a person stands behind 600 pages rather than a pipeline,
 * so it is worth keeping specific and first-person — how long you have been
 * doing this, and what you actually do to produce a guide. */
export const SITE_OWNER_BIO =
  "I've been hooked on technology for as long as I can remember — especially the new tools and AI apps that seem to land every other week. Easy Tech Tuts is where I write up whatever I've just worked out: I do the task in the real product, record the screen, and turn it into the guide I wish I'd found first.";

/** Headshot in /public. Empty string falls back to a monogram, so the box
 * still looks deliberate before a photo exists. */
export const SITE_OWNER_PHOTO = "/author.webp";

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
