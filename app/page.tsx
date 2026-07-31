import Link from "next/link";
import { getCategories, getFeaturedDeepTutorials } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { TutorialListItem } from "@/components/TutorialListItem";
import { SITE_NAME } from "@/lib/site";

export default function Home() {
  const categories = getCategories();
  const latest = getFeaturedDeepTutorials(10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Free, step-by-step tutorials for the software you use every day
        </h1>
        <p className="mt-4 text-lg text-muted">
          {SITE_NAME} pairs a video walkthrough with a written guide for every task — Shopify,
          QuickBooks, Power BI, Canva, Google Workspace, and hundreds more tools, organized by topic.
          Watch it or skim it, whichever is faster.
        </p>
      </section>

      {latest.length > 0 && (
        <section id="latest" className="mt-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recently updated guides</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Rewritten with real in-app screenshots and a fuller walkthrough, across different tools.
          </p>
          <div className="mt-6 max-w-3xl">
            {latest.map((t) => (
              <TutorialListItem key={t.video.id} tutorial={t} showCategory />
            ))}
          </div>
        </section>
      )}

      <section id="categories" className="mt-16 scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Browse by category</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every tool covered on the site, grouped by what you use it for.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <p className="mt-12 text-sm text-muted">
        New here? <Link href="/about" className="text-accent hover:underline">Read more about this site</Link>.
      </p>
    </div>
  );
}
