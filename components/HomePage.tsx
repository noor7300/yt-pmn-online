import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getDeepTutorialsPaged, getFeaturedTutorials, getDeepDiveGuides } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { TutorialListItem } from "@/components/TutorialListItem";
import { FeaturedStart } from "@/components/FeaturedStart";
import { FeaturedGuides } from "@/components/FeaturedGuides";
import { Pagination } from "@/components/Pagination";
import { SITE_NAME } from "@/lib/site";

/** Shared by "/" (page 1) and "/page/[page]" (page 2+) so the whole site,
 * not just the tutorial list, gets a consistent template across pages. */
export function HomePage({ page }: { page: number }) {
  const categories = getCategories();
  const totalGuides = categories.reduce((sum, c) => sum + c.count, 0);
  const { items, currentPage, totalPages } = getDeepTutorialsPaged(page);
  if (items.length === 0) notFound();

  // "Featured" sections only make sense on the actual homepage — page 2+ of
  // the latest feed is just more of the same list, not a fresh front page.
  const recentIds = new Set(page === 1 ? items.map((t) => t.video.id) : []);
  const featured = page === 1 ? getFeaturedTutorials(4, recentIds) : [];
  const featuredIds = new Set(featured.map((t) => t.video.id));
  const deepDives = page === 1 ? getDeepDiveGuides(2, new Set([...recentIds, ...featuredIds])) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="max-w-2xl border-b border-line py-16 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">
          AI tools &amp; business software, explained
        </span>
        <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          The tools that actually change how you <span className="gradient-text">work</span>.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
          {SITE_NAME} pairs a video walkthrough with a written guide built from the actual product — ChatGPT,
          Claude, QuickBooks, Power BI, Notion, Figma, and {categories.length}+ more tools.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <Link
            href="#latest"
            className="gradient-brand rounded-lg px-5 py-3 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Browse tutorials
          </Link>
          <Link href="#categories" className="border-b border-line-strong pb-0.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent-strong">
            Explore all tools →
          </Link>
        </div>
        <div className="mt-10 flex gap-7 text-sm text-muted">
          <span>
            <b className="font-semibold text-foreground">{totalGuides.toLocaleString()}+</b> guides
          </span>
          <span>
            <b className="font-semibold text-foreground">{categories.length}+</b> tools covered
          </span>
          <span>
            <b className="font-semibold text-foreground">Weekly</b> updates
          </span>
        </div>
      </section>

      <FeaturedStart tutorials={featured} />

      <section id="latest" className="scroll-mt-20 border-b border-line py-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Latest</span>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
              Recently updated guides{currentPage > 1 ? ` — Page ${currentPage}` : ""}
            </h2>
            <p className="mt-2 max-w-lg text-muted">
              Rewritten with real in-app screenshots and a fuller walkthrough, across different tools.
            </p>
          </div>
        </div>
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

      <section id="categories" className="scroll-mt-20 py-14">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Discover</span>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
          Browse all {categories.length} tools
        </h2>
        <p className="mt-2 max-w-lg text-muted">Every category covered on the site, most tutorials first.</p>
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <p className="border-t border-line py-8 text-sm text-muted">
        New here? <Link href="/about" className="text-accent-strong hover:underline">Read more about this site</Link>.
      </p>
    </div>
  );
}
