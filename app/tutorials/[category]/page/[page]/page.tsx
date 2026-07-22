import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory, CATEGORY_PAGE_SIZE } from "@/lib/data";
import { CategoryTutorialGrid } from "@/components/CategoryTutorialGrid";

export function generateStaticParams() {
  return getCategories().flatMap((c) => {
    const totalPages = Math.max(1, Math.ceil(c.count / CATEGORY_PAGE_SIZE));
    // Page 1 is served by /tutorials/[category]; this route covers pages 2+.
    return Array.from({ length: totalPages - 1 }, (_, i) => ({
      category: c.slug,
      page: String(i + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, page } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};

  return {
    title: `${category.label} Tutorials — Page ${page}`,
    description: `More free, step-by-step ${category.label} tutorials — page ${page}.`,
    alternates: { canonical: `/tutorials/${category.slug}/page/${page}` },
  };
}

export default async function CategoryPagedPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category: categorySlug, page } = await params;
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 2) notFound();

  return <CategoryTutorialGrid categorySlug={categorySlug} page={pageNum} />;
}
