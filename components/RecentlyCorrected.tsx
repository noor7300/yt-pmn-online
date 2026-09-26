import Link from "next/link";
import type { PublishedTutorial } from "@/lib/data";
import { excerpt } from "@/lib/format";

/** Guides paired with the specific thing their last re-check changed, taken
 * from each page's own verification note. */
export function RecentlyCorrected({ items }: { items: { tutorial: PublishedTutorial; change: string }[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-b border-line py-14">
      <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Kept up to date</span>
      <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
        What our last check changed
      </h2>
      <p className="mt-2 max-w-2xl text-muted">
        Software changes after a guide is recorded. Each guide here was re-read against the vendor&apos;s own help
        pages, and anything that had drifted was fixed. This is what changed on a few of them.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ tutorial: t, change }) => {
          const href = `/tutorials/${t.video.category}/${t.video.slug}`;
          return (
            <article key={t.video.id} className="flex flex-col rounded-xl border border-line p-5">
              <Link
                href={`/tutorials/${t.video.category}`}
                className="text-[11px] font-semibold uppercase tracking-wide text-accent-strong hover:underline"
              >
                {t.video.categoryLabel}
              </Link>
              <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">
                <Link href={href} className="hover:text-accent-strong">
                  {t.article.seoTitle}
                </Link>
              </h3>
              <p className="mt-3 flex-1 border-l-2 border-line-strong pl-3 text-sm leading-relaxed text-muted">
                {excerpt(change, 230)}
              </p>
              <p className="mt-4 text-xs text-muted">
                {t.article.references?.length ?? 0} official source
                {t.article.references?.length === 1 ? "" : "s"} cited
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
