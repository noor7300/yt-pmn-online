import type { FaqItem } from "@/lib/types";

export function FaqBlock({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <h2 id="faq-heading" className="text-xl font-semibold text-foreground">
        Frequently asked questions
      </h2>
      <dl className="mt-4 divide-y divide-line rounded-md border border-line bg-panel">
        {items.map((item) => (
          <div key={item.question} className="p-4">
            <dt className="font-medium text-foreground">{item.question}</dt>
            <dd className="mt-1 text-sm text-muted">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
