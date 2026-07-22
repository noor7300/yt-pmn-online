import { notFound } from "next/navigation";
import { getCategory, getTutorialsByCategoryPaged } from "@/lib/data";
import { TutorialCard } from "./TutorialCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

export function CategoryTutorialGrid({ categorySlug, page }: { categorySlug: string; page: number }) {
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const { items, currentPage, totalPages } = getTutorialsByCategoryPaged(categorySlug, page);
  if (items.length === 0) notFound();

  const url = `${SITE_URL}/tutorials/${category.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: category.label, url },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: category.label, href: `/tutorials/${category.slug}` }]} />

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        {category.label} Tutorials{currentPage > 1 ? ` — Page ${currentPage}` : ""}
      </h1>
      <p className="mt-2 max-w-2xl text-muted">
        {category.count} free, step-by-step {category.label} guides covering setup, common tasks, fixes, and
        best practices — each with a full video walkthrough.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t) => (
          <TutorialCard key={t.video.id} tutorial={t} />
        ))}
      </div>

      <Pagination categorySlug={category.slug} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
