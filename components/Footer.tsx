import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getGroups } from "@/lib/data";

export function Footer() {
  const groups = getGroups().slice(0, 6);

  return (
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
          {groups.map((group) => (
            <div key={group.slug}>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-accent">{group.label}</h3>
              <ul className="mt-3 space-y-2">
                {group.categories.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/tutorials/${c.slug}`} className="text-sm text-muted hover:text-foreground">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE_NAME}. All product names and trademarks belong to
            their respective owners.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <Link href="/about" className="text-muted hover:text-accent">
              About
            </Link>
            <Link href="/contact" className="text-muted hover:text-accent">
              Contact
            </Link>
            <Link href="/privacy" className="text-muted hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted hover:text-accent">
              Terms of Use
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
