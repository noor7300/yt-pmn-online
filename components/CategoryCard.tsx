import Link from "next/link";
import type { CategorySummary } from "@/lib/data";

export function CategoryCard({ category }: { category: CategorySummary }) {
  return (
    <Link
      href={`/tutorials/${category.slug}`}
      className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">{category.groupLabel}</span>
      <span className="mt-1 text-base font-semibold text-zinc-900">{category.label}</span>
      <span className="mt-2 text-xs text-zinc-500">
        {category.count} tutorial{category.count === 1 ? "" : "s"}
      </span>
    </Link>
  );
}
