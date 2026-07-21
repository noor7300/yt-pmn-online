import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/#categories" className="hover:text-zinc-900">
            Categories
          </Link>
          <Link href="/#latest" className="hover:text-zinc-900">
            Latest
          </Link>
        </nav>
      </div>
    </header>
  );
}
