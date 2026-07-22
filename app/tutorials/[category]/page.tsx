import type { Metadata } from "next";
import { getCategories, getCategory } from "@/lib/data";
import { CategoryTutorialGrid } from "@/components/CategoryTutorialGrid";

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
  return <CategoryTutorialGrid categorySlug={categorySlug} page={1} />;
}
