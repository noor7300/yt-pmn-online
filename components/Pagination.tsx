import Link from "next/link";

function pageHref(categorySlug: string, page: number): string {
  return page <= 1 ? `/tutorials/${categorySlug}` : `/tutorials/${categorySlug}/page/${page}`;
}

export function Pagination({
  categorySlug,
  currentPage,
  totalPages,
}: {
  categorySlug: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-line pt-6">
      {currentPage > 1 ? (
        <Link href={pageHref(categorySlug, currentPage - 1)} className="text-sm font-medium text-accent hover:opacity-80">
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="font-mono text-sm text-muted tabular-nums">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link href={pageHref(categorySlug, currentPage + 1)} className="text-sm font-medium text-accent hover:opacity-80">
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
