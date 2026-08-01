import Link from "next/link";
import Image from "next/image";
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
              <Image src="/logo-mark.webp" alt="" width={26} height={24} className="h-6 w-auto" />
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-muted">
              Step-by-step guides for the AI tools and business software you use every day.
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-accent-strong">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted hover:text-accent-strong">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-accent-strong">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted hover:text-accent-strong">
                  Terms of Use
                </Link>
              </li>
            </ul>
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
        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE_NAME}. All product names and trademarks belong to
            their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
