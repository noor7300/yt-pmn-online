import { getCategories, getPublishedTutorials } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { TutorialCard } from "@/components/TutorialCard";
import { SITE_NAME } from "@/lib/site";

export default function Home() {
  const categories = getCategories();
  const latest = getPublishedTutorials().slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Free, step-by-step tutorials for the software you use every day
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          {SITE_NAME} turns thousands of hands-on YouTube tutorials into searchable, written guides —
          Shopify, QuickBooks, Power BI, Canva, Google Workspace, and hundreds more tools, organized by
          topic.
        </p>
      </section>

      <section id="categories" className="mt-16 scroll-mt-20">
        <h2 className="text-2xl font-semibold text-zinc-900">Browse by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {latest.length > 0 && (
        <section id="latest" className="mt-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-zinc-900">Most popular tutorials</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((t) => (
              <TutorialCard key={t.video.id} tutorial={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
