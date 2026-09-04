import type { GeneratedArticle } from "@/lib/types";

/** Blocks that only some articles carry. Each renders nothing when its field
 * is absent, which is the point: the fields exist so a guide can show what its
 * subject warrants instead of every page wearing the same shape. */

export function Prerequisites({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section aria-labelledby="prereq-heading" className="mt-8 rounded-xl border border-line bg-panel-2 p-5">
      <h2 id="prereq-heading" className="scroll-mt-24 text-sm font-bold uppercase tracking-wide text-accent-strong">
        Before you start
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CostNote({ note }: { note?: string }) {
  if (!note) return null;
  return (
    <aside className="mt-6 rounded-xl border-l-4 border-accent bg-panel-2 px-5 py-4">
      <p className="text-sm font-semibold text-foreground">Does this cost anything?</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{note}</p>
    </aside>
  );
}

export function ArticleTables({ tables }: { tables?: GeneratedArticle["tables"] }) {
  if (!tables?.length) return null;
  return (
    <div className="mt-10 space-y-8">
      {tables.map((table) => (
        <figure key={table.title}>
          <figcaption className="text-sm font-bold uppercase tracking-wide text-accent-strong">
            {table.title}
          </figcaption>
          {/* Wide tables scroll inside their own box so the page body never
              scrolls sideways on a phone. */}
          <div className="mt-3 overflow-x-auto rounded-xl border border-line">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead className="bg-panel-2">
                <tr>
                  {table.columns.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 font-semibold text-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-t border-line align-top">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 leading-relaxed text-muted">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.note && <p className="mt-2 text-sm text-muted">{table.note}</p>}
        </figure>
      ))}
    </div>
  );
}

export function Troubleshooting({ items }: { items?: GeneratedArticle["troubleshooting"] }) {
  if (!items?.length) return null;
  return (
    <section aria-labelledby="trouble-heading" className="mt-14 border-t border-line pt-10">
      <h2 id="trouble-heading" className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground">
        When it doesn&apos;t work
      </h2>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.problem} className="rounded-xl border border-line bg-panel p-5">
            <p className="font-semibold text-foreground">{item.problem}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              <span className="font-medium text-foreground/80">Why: </span>
              {item.cause}
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
              <span className="font-medium text-foreground/80">Fix: </span>
              {item.fix}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SourcesAndVerification({
  references,
  verifiedNote,
}: {
  references?: GeneratedArticle["references"];
  verifiedNote?: string;
}) {
  if (!references?.length && !verifiedNote) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-14 border-t border-line pt-10">
      <h2 id="sources-heading" className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground">
        Sources and last check
      </h2>

      {verifiedNote && <p className="mt-3 text-[15px] leading-relaxed text-muted">{verifiedNote}</p>}

      {references?.length ? (
        <ul className="mt-4 space-y-2">
          {references.map((ref) => (
            <li key={ref.url} className="text-[15px] leading-relaxed">
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-line-strong pb-0.5 text-foreground transition hover:border-accent hover:text-accent-strong"
              >
                {ref.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
