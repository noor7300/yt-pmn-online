import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getTutorialsByCategory } from "@/lib/data";
import { TutorialCard } from "@/components/TutorialCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};

  const title = `${category.label} Tutorials`;
  const description = `${category.count} free, step-by-step ${category.label} tutorials covering setup, common tasks, and troubleshooting.`;

  return {
    title,
    description,
    alternates: { canonical: `/tutorials/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const tutorials = getTutorialsByCategory(category.slug);
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

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">{category.label} Tutorials</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        {category.count} free, step-by-step {category.label} guides covering setup, common tasks, fixes, and
        best practices — each with a full video walkthrough.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tutorials.map((t) => (
          <TutorialCard key={t.video.id} tutorial={t} />
        ))}
      </div>
    </div>
  );
}
