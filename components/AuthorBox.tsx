import Image from "next/image";
import Link from "next/link";
import { SITE_OWNER, SITE_OWNER_BIO, SITE_OWNER_PHOTO, SITE_EMAIL } from "@/lib/site";

/** First letter of the first two words — "Impran M N" gives IM, not IMN. */
function monogram(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Byline block closing every tutorial: who wrote this, why they'd know, and
 * how to reach them. Reads from the SITE_OWNER_* constants so a photo or a
 * reworded bio lands on all 600 pages from one edit. */
export function AuthorBox() {
  return (
    <section aria-labelledby="author-heading" className="mt-14 border-t border-line pt-10">
      <h2 id="author-heading" className="sr-only">
        About the author
      </h2>

      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-panel-2 p-6 sm:flex-row sm:gap-6 sm:p-7">
        {SITE_OWNER_PHOTO ? (
          <Image
            src={SITE_OWNER_PHOTO}
            alt={SITE_OWNER}
            width={72}
            height={72}
            className="h-[72px] w-[72px] shrink-0 rounded-full border border-line object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="gradient-brand flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-xl font-bold tracking-wide text-on-accent shadow-sm shadow-black/10"
          >
            {monogram(SITE_OWNER)}
          </span>
        )}

        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">
            Written by
          </span>
          <p className="mt-1 text-lg font-bold tracking-tight text-foreground">{SITE_OWNER}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{SITE_OWNER_BIO}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            <Link
              href="/about"
              className="border-b border-line-strong pb-0.5 text-foreground transition hover:border-accent hover:text-accent-strong"
            >
              More about this site
            </Link>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="border-b border-line-strong pb-0.5 text-foreground transition hover:border-accent hover:text-accent-strong"
            >
              Suggest a correction
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
