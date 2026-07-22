import Link from "next/link";
import type { CategorySummary } from "@/lib/data";

export function CategoryCard({ category }: { category: CategorySummary }) {
  return (
    <Link
      href={`/tutorials/${category.slug}`}
      className="flex flex-col justify-between rounded-md border border-line bg-panel p-4 transition hover:border-accent"
    >
      <span className="font-mono text-xs font-medium uppercase tracking-wide text-accent">
        {category.groupLabel}
      </span>
      <span className="mt-1 text-base font-semibold text-foreground">{category.label}</span>
      <span className="mt-2 font-mono text-xs text-muted tabular-nums">
        {category.count} tutorial{category.count === 1 ? "" : "s"}
      </span>
    </Link>
  );
}
