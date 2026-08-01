import Link from "next/link";
import Image from "next/image";
import { getGroups } from "@/lib/data";
import { NavCategoryDropdown } from "@/components/NavCategoryDropdown";
import { NavMoreDropdown } from "@/components/NavMoreDropdown";
import { NavScrollShell } from "@/components/NavScrollShell";
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
    <NavScrollShell>
      <div className="mx-auto flex max-w-6xl items-center gap-7 px-4 py-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
          <Image src="/logo-mark.webp" alt="" width={31} height={28} className="h-7 w-auto" priority />
          {SITE_NAME}
        </Link>
        <nav className="flex flex-1 items-center gap-6 overflow-x-auto text-[13.5px] font-medium text-muted [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href="/#categories" className="shrink-0 hover:text-foreground">
            Categories
          </Link>
          <Link href="/#latest" className="shrink-0 hover:text-foreground">
            Latest
          </Link>
          {topGroups.map((group) => (
            <NavCategoryDropdown key={group.slug} label={group.label} categories={group.categories} />
          ))}
          {restGroups.length > 0 && <NavMoreDropdown groups={restGroups} />}
        </nav>
        <Link
          href="/#latest"
          className="gradient-brand hidden shrink-0 rounded-lg px-4 py-2 text-[13px] font-semibold text-on-accent transition-transform hover:-translate-y-0.5 sm:inline-block"
        >
          Browse tutorials
        </Link>
      </div>
    </NavScrollShell>
  );
}
