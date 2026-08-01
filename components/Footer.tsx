import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getGroups } from "@/lib/data";

export function Footer() {
  const groups = getGroups().slice(0, 4);

  return (
    <footer className="mt-20 border-t border-line bg-panel-2">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
              <span className="gradient-brand h-5 w-5 rounded-md" aria-hidden="true" />
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-muted">
              Step-by-step guides for the AI tools and business software you use every day.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.slug}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{group.label}</h3>
              <ul className="mt-3.5 space-y-2.5">
                {group.categories.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/tutorials/${c.slug}`} className="text-sm text-muted hover:text-accent-strong">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE_NAME}. All product names and trademarks belong to
            their respective owners.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <Link href="/about" className="text-muted hover:text-accent-strong">
              About
            </Link>
            <Link href="/contact" className="text-muted hover:text-accent-strong">
              Contact
            </Link>
            <Link href="/privacy" className="text-muted hover:text-accent-strong">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted hover:text-accent-strong">
              Terms of Use
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
