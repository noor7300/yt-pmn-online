import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDeepTutorials, HOME_PAGE_SIZE } from "@/lib/data";
import { HomePage } from "@/components/HomePage";

/** Matches the homepage: the rotation only advances if these regenerate. */
export const revalidate = 86400;

export function generateStaticParams() {
  const totalPages = Math.max(1, Math.ceil(getDeepTutorials().length / HOME_PAGE_SIZE));
  // Page 1 is served by "/"; this route covers pages 2+.
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Browse Guides — Page ${page}`,
    description: `More step-by-step software guides from the library — page ${page}.`,
    alternates: { canonical: `/page/${page}` },
  };
}

export default async function HomePagedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 2) notFound();

  return <HomePage page={pageNum} />;
}
