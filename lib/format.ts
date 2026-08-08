/** Format an ISO date as e.g. "July 21, 2026". Uses UTC so the rendered
 * string is identical at build time and in every reader's timezone. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Word count of a deep article's readable text (intro + all step bodies). */
export function articleWordCount(article: { intro: string; steps: { body: string }[] }): number {
  const text = [article.intro, ...article.steps.map((s) => s.body)].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** Anchor ids for a list of headings, in order. Ids double as shareable deep
 * links, so they're derived from the heading text rather than its position;
 * a repeated heading gets a numeric suffix so every id stays unique. */
export function headingAnchors(headings: string[]): string[] {
  const seen = new Map<string, number>();
  return headings.map((heading) => {
    const base =
      heading
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}

/** Trim prose to a whole word near `max` characters, adding an ellipsis. */
export function excerpt(text: string, max = 180): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/** Break a body string into short paragraphs (~`per` sentences each) so long
 * blocks read as a few lines rather than a wall of text. Splits only at a
 * sentence end followed by a capitalised next sentence, which leaves decimals
 * like "$25.00" and lowercase abbreviations ("e.g.") intact. A lone trailing
 * sentence is folded back into the previous paragraph. */
export function toParagraphs(body: string, per = 2): string[] {
  const sentences = body
    .split(/(?<=[.!?])\s+(?=["'“]?[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= per) return [body.trim()];

  const paras: string[] = [];
  for (let i = 0; i < sentences.length; i += per) {
    paras.push(sentences.slice(i, i + per).join(" "));
  }
  if (paras.length > 1 && sentences.length % per === 1) {
    paras[paras.length - 2] += ` ${paras[paras.length - 1]}`;
    paras.pop();
  }
  return paras;
}
