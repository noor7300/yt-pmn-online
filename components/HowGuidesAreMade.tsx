import Link from "next/link";
import type { SiteStats } from "@/lib/data";
import { SITE_OWNER } from "@/lib/site";

/** How a guide gets made, in the order it actually happens. Every claim here
 * is something a reader can check on any guide page: the screenshots, and the
 * "Sources and last check" section at the bottom. */
export function HowGuidesAreMade({ stats }: { stats: SiteStats }) {
  const steps = [
    {
      title: "Done in the real product",
      body: `${SITE_OWNER} carries out each task in the actual app and records the screen. The screenshots in a guide come from that recording, not from stock images or mock-ups.`,
    },
    {
      title: "Written step by step",
      body: "The recording is turned into numbered steps, each with the screen it describes. Pages cover what the task needs: some carry prerequisites, costs, comparison tables or a troubleshooting section, and some don't.",
    },
    {
      title: "Checked against the vendor's docs",
      body: `Menus move and plans change, so guides are re-read against the vendor's own help pages. ${stats.checked} of ${stats.guides} guides have been through that check so far, citing ${stats.sources.toLocaleString()} official pages across ${stats.sourceSites} sites.`,
    },
    {
      title: "Changes are written down",
      body: "The bottom of every checked guide says what was compared, against which pages, and what was corrected. Nothing there claims testing that didn't happen.",
    },
  ];

  return (
    <section className="border-b border-line py-14">
      <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">How it works</span>
      <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
        How each guide is made
      </h2>

      <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="gradient-text font-mono text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-[15px] font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-muted">
        Spotted something out of date?{" "}
        <Link href="/contact" className="text-accent-strong hover:underline">
          Let me know
        </Link>{" "}
        and the guide gets another look. More about the site is on the{" "}
        <Link href="/about" className="text-accent-strong hover:underline">
          about page
        </Link>
        .
      </p>
    </section>
  );
}
