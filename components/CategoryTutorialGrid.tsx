import { notFound } from "next/navigation";
import { getCategory, getTutorialsByCategoryPaged } from "@/lib/data";
import { TutorialListItem } from "./TutorialListItem";
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: category.label, url },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: category.label, href: `/tutorials/${category.slug}` }]} />

      <header className="mt-6 border-b border-line pb-8">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">{category.groupLabel}</span>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {category.label} tutorials{currentPage > 1 ? ` — page ${currentPage}` : ""}
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          {category.count} free, step-by-step {category.label} guides covering setup, common tasks, fixes, and
          best practices — each with a full video walkthrough.
        </p>
      </header>

      <div className="mt-8">
        {items.map((t) => (
          <TutorialListItem key={t.video.id} tutorial={t} />
        ))}
      </div>

      <Pagination basePath={`/tutorials/${category.slug}`} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
