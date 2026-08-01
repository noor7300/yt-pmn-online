import Link from "next/link";

function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath || "/" : `${basePath}/page/${page}`;
}

/** Condense a long page range to: 1 … current-1 current current+1 … last */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);
  if (current <= 3) [2, 3, 4].forEach((p) => p < total && pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => p > 1 && pages.add(p));

  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  for (const [i, p] of sorted.entries()) {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  }
  return out;
}

const linkBase =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 font-mono text-sm tabular-nums transition";

export function Pagination({
  basePath,
  currentPage,
  totalPages,
}: {
  /** Route root pages hang off, e.g. "/tutorials/shopify", or "" for the
   * homepage (page 1 lives at "/", page N at "/page/N"). */
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 border-t border-line pt-6">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {currentPage > 1 ? (
            <Link
              href={pageHref(basePath, currentPage - 1)}
              rel="prev"
              className={`${linkBase} border-line text-muted hover:border-accent hover:text-accent`}
            >
              ← Prev
            </Link>
          ) : (
            <span className={`${linkBase} border-line/50 text-muted/40`}>← Prev</span>
          )}
        </li>

        {pageWindow(currentPage, totalPages).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} className="px-1 font-mono text-sm text-muted" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              {p === currentPage ? (
                <span
                  aria-current="page"
                  className={`${linkBase} border-accent bg-accent/10 font-semibold text-accent`}
                >
                  {p}
                </span>
              ) : (
                <Link
                  href={pageHref(basePath, p)}
                  className={`${linkBase} border-line text-muted hover:border-accent hover:text-accent`}
                >
                  {p}
                </Link>
              )}
            </li>
          )
        )}

        <li>
          {currentPage < totalPages ? (
            <Link
              href={pageHref(basePath, currentPage + 1)}
              rel="next"
              className={`${linkBase} border-line text-muted hover:border-accent hover:text-accent`}
            >
              Next →
            </Link>
          ) : (
            <span className={`${linkBase} border-line/50 text-muted/40`}>Next →</span>
          )}
        </li>
      </ul>

      <p className="mt-4 text-center font-mono text-xs text-muted">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
}
