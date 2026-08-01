import Link from "next/link";
import { getGroups } from "@/lib/data";
import { NavCategoryDropdown } from "@/components/NavCategoryDropdown";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  const groups = getGroups();

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
          {groups.map((group) => (
            <NavCategoryDropdown key={group.slug} label={group.label} categories={group.categories} />
          ))}
        </nav>
      </div>
    </header>
  );
}
