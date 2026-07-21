import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getGroups } from "@/lib/data";

export function Footer() {
  const groups = getGroups().slice(0, 6);

  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
          {groups.map((group) => (
            <div key={group.slug}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{group.label}</h3>
              <ul className="mt-3 space-y-2">
                {group.categories.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/tutorials/${c.slug}`} className="text-sm text-zinc-600 hover:text-zinc-900">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-zinc-400">
          © {new Date().getFullYear()} {SITE_NAME}. Tutorials sourced from the PMN Online YouTube channel.
        </p>
      </div>
    </footer>
  );
}
