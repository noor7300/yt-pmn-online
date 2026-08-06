import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { getCategories, getVisibleTutorials } from "@/lib/data";
import { SITE_NAME, SITE_OWNER, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Who runs ${SITE_NAME}, what you'll find here, and how the tutorials are put together.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const categoryCount = getCategories().length;
  const tutorialCount = getVisibleTutorials().length;

  return (
    <ProsePage
      title={`About ${SITE_NAME}`}
      intro={`${SITE_NAME} is a free library of step-by-step software tutorials, covering ${categoryCount} tools across accounting, design, analytics, e-commerce, project management, and more.`}
    >
      <section>
        <h2>Who runs this site</h2>
        <p>
          This site is created and maintained by {SITE_OWNER}. Every tutorial published here comes
          from hands-on work with the software it covers — recording the process, then writing it up
          as a guide you can follow at your own pace.
        </p>
        <p>
          You can reach me directly at{" "}
          <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>, or through the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </section>

      <section>
        <h2>What you&apos;ll find here</h2>
        <p>
          The library currently holds {tutorialCount.toLocaleString()} tutorials. Each one pairs a
          video walkthrough with a written guide covering the same steps, so you can either watch it
          or skim the text — whichever is faster for the task in front of you.
        </p>
        <p>Most guides fall into one of a few shapes:</p>
        <ul>
          <li>
            <strong>Setup guides</strong> — getting a tool configured for the first time
          </li>
          <li>
            <strong>Task walkthroughs</strong> — doing one specific thing, start to finish
          </li>
          <li>
            <strong>Fixes</strong> — resolving a specific error or unexpected behaviour
          </li>
          <li>
            <strong>Comparisons</strong> — choosing between tools that solve the same problem
          </li>
        </ul>
      </section>

      <section>
        <h2>How the written guides are produced</h2>
        <p>
          The written guide on each page is derived from the accompanying video walkthrough and its
          notes, then edited for the web. Where a video covers a process that has changed since
          recording, the written steps stay at the level the source material actually supports rather
          than inventing detail — so you may occasionally see a guide describe an approach in general
          terms instead of naming an exact button.
        </p>
        <p>
          Software interfaces change often. If you hit a step that no longer matches what you see on
          screen, please <Link href="/contact">tell me</Link> — corrections are genuinely useful and
          I update pages when they&apos;re reported.
        </p>
      </section>

      <section>
        <h2>What this site is not</h2>
        <p>
          {SITE_NAME} is an independent tutorial site. It is not affiliated with, endorsed by, or
          sponsored by any of the software companies whose products are covered here. All product
          names, logos, and trademarks belong to their respective owners and are used only to
          describe what each tutorial teaches.
        </p>
        <p>
          Nothing here is professional advice. Tutorials touching on accounting, tax, or trading
          software explain how to operate the software — they are not financial, tax, or legal advice.
          For decisions with real consequences, talk to a qualified professional.
        </p>
      </section>
    </ProsePage>
  );
}
