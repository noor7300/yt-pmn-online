import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGroups,
  getDeepTutorialsPaged,
  getFeaturedTutorials,
  getDeepDiveGuides,
  getRecentlyCorrected,
  getSiteStats,
} from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { TutorialListItem } from "@/components/TutorialListItem";
import { FeaturedStart } from "@/components/FeaturedStart";
import { FeaturedGuides } from "@/components/FeaturedGuides";
import { RecentlyCorrected } from "@/components/RecentlyCorrected";
import { HowGuidesAreMade } from "@/components/HowGuidesAreMade";
import { Pagination } from "@/components/Pagination";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/site";

/** Shared by "/" (page 1) and "/page/[page]" (page 2+) so the whole site,
 * not just the tutorial list, gets a consistent template across pages. */
export function HomePage({ page }: { page: number }) {
  const groups = getGroups();
  const toolCount = groups.reduce((sum, g) => sum + g.categories.length, 0);
  const stats = getSiteStats();
  const { items, currentPage, totalPages } = getDeepTutorialsPaged(page);
  if (items.length === 0) notFound();

  // Feature sections belong to the front page only; page 2+ is more of the
  // browse feed. Each pick excludes what's already shown so nothing repeats.
  const isFront = page === 1;
  const shown = new Set(isFront ? items.map((t) => t.video.id) : []);
  const featured = isFront ? getFeaturedTutorials(4, shown) : [];
  featured.forEach((t) => shown.add(t.video.id));
  const deepDives = isFront ? getDeepDiveGuides(2, shown) : [];
  deepDives.forEach((t) => shown.add(t.video.id));
  const corrected = isFront ? getRecentlyCorrected(6, shown) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {isFront && (
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/icon.png`,
            },
          ]}
        />
      )}

      <section className="max-w-2xl border-b border-line py-16 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">
          AI tools &amp; business software, explained
        </span>
        <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          The tools that actually change how you <span className="gradient-text">work</span>.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
          {SITE_NAME} walks you through each task step by step, with screenshots from the real product. ChatGPT,
          Claude, QuickBooks, Power BI, Notion, Figma and {toolCount - 6}+ more tools, each guide checked against
          the vendor&apos;s own documentation.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <Link
            href="#latest"
            className="gradient-brand rounded-lg px-5 py-3 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Browse tutorials
          </Link>
          <Link
            href="#categories"
            className="border-b border-line-strong pb-0.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent-strong"
          >
            Explore all tools →
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted">
          <span>
            <b className="font-semibold text-foreground">{stats.guides.toLocaleString()}</b> guides
          </span>
          <span>
            <b className="font-semibold text-foreground">{stats.checked.toLocaleString()}</b> checked against official
            docs
          </span>
          <span>
            <b className="font-semibold text-foreground">{stats.sources.toLocaleString()}</b> official sources cited
          </span>
        </div>
      </section>

      <FeaturedStart tutorials={featured} />

      <RecentlyCorrected items={corrected} />

      <section id="latest" className="scroll-mt-20 border-b border-line py-14">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">From the library</span>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
          Guides to explore{currentPage > 1 ? `, page ${currentPage}` : ""}
        </h2>
        <p className="mt-2 max-w-lg text-muted">
          A different selection each day from all {stats.guides.toLocaleString()} guides, each written from a real
          run-through with screenshots from the app itself.
        </p>
        <div className="mt-8 max-w-3xl">
          {items.map((t) => (
            <TutorialListItem key={t.video.id} tutorial={t} showCategory />
          ))}
        </div>
        <div className="max-w-3xl">
          <Pagination basePath="" currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>

      <FeaturedGuides tutorials={deepDives} />

      {isFront && <HowGuidesAreMade stats={stats} />}

      <section id="categories" className="scroll-mt-20 py-14">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Discover</span>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
          Browse all {toolCount} tools
        </h2>
        <p className="mt-2 max-w-lg text-muted">Grouped by what you&apos;re trying to get done.</p>

        <div className="mt-10 space-y-10">
          {groups.map((g) => {
            const guides = g.categories.reduce((sum, c) => sum + c.count, 0);
            return (
              <div key={g.slug}>
                <h3 className="flex items-baseline gap-3 text-base font-semibold text-foreground">
                  {g.label}
                  <span className="text-xs font-normal tabular-nums text-muted">
                    {guides} guide{guides === 1 ? "" : "s"}
                  </span>
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {g.categories.map((category) => (
                    <CategoryCard key={category.slug} category={category} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
