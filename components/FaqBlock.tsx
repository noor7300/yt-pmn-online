import type { FaqItem } from "@/lib/types";

export function FaqBlock({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-14 border-t border-line pt-10">
      <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">FAQ</span>
      <h2 id="faq-heading" className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
        Frequently asked questions
      </h2>
      <div className="mt-6 divide-y divide-line rounded-xl border border-line">
        {items.map((item) => (
          <details key={item.question} className="group p-5 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none">
              {item.question}
              <span
                aria-hidden="true"
                className="shrink-0 text-lg text-muted transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
