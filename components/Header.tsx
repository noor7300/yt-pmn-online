import Link from "next/link";
import { getGroups } from "@/lib/data";
import { NavCategoryDropdown } from "@/components/NavCategoryDropdown";
import { NavMoreDropdown } from "@/components/NavMoreDropdown";
import { SITE_NAME } from "@/lib/site";

// Highest-volume groups get a direct nav slot with a short label; everything
// else lives in the "More" dropdown so the bar doesn't run to 19 items.
const TOP_GROUPS: { slug: string; label: string }[] = [
  { slug: "accounting", label: "Finance" },
  { slug: "productivity", label: "Productivity" },
  { slug: "project-management", label: "Projects" },
  { slug: "website-hosting", label: "Websites" },
  { slug: "data-bi", label: "Analytics" },
];

export function Header() {
  const groups = getGroups();
  const byGroupSlug = new Map(groups.map((g) => [g.slug, g]));

  const topGroups = TOP_GROUPS.map((t) => ({ ...t, categories: byGroupSlug.get(t.slug)?.categories ?? [] })).filter(
    (t) => t.categories.length > 0
  );
  const topSlugs = new Set(TOP_GROUPS.map((t) => t.slug));
  const restGroups = groups.filter((g) => !topSlugs.has(g.slug));

  return (
    <header className="border-b border-line bg-background/90 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight text-foreground">
          {SITE_NAME}
        </Link>
        <nav
          className="flex flex-1 items-center gap-6 overflow-x-auto font-mono text-xs font-medium uppercase tracking-wide text-muted [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link href="/#categories" className="shrink-0 hover:text-accent">
            Categories
          </Link>
          <Link href="/#latest" className="shrink-0 hover:text-accent">
            Latest
          </Link>
          {topGroups.map((group) => (
            <NavCategoryDropdown key={group.slug} label={group.label} categories={group.categories} />
          ))}
          {restGroups.length > 0 && <NavMoreDropdown groups={restGroups} />}
        </nav>
      </div>
    </header>
  );
}
