import Link from "next/link";
import type { CategorySummary } from "@/lib/data";

export function CategoryCard({ category }: { category: CategorySummary }) {
  const initial = category.label.replace(/[^A-Za-z]/, "")[0] ?? category.label[0];

  return (
    <Link
      href={`/tutorials/${category.slug}`}
      className="group flex items-center gap-3 rounded-xl border border-line p-3 transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-panel-2"
    >
      <span className="gradient-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-on-accent opacity-90">
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold leading-tight text-foreground">{category.label}</span>
        <span className="mt-0.5 block text-xs tabular-nums text-muted">
          {category.count} tutorial{category.count === 1 ? "" : "s"}
        </span>
      </span>
    </Link>
  );
}
