import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { SITE_NAME, SITE_OWNER, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that apply when you use ${SITE_NAME}, including accuracy, trademarks, and liability.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ProsePage
      title="Terms of Use"
      updated="July 30, 2026"
      intro={`By using ${SITE_NAME}, you agree to the terms below. They're short and written in plain language.`}
    >
      <section>
        <h2>Using the tutorials</h2>
        <p>
          Everything on this site is free to read and follow for your own personal or business use.
          You don&apos;t need permission to use what you learn here.
        </p>
        <p>
          What you may not do is republish the written guides wholesale on another site, or
          redistribute them as your own content. Quoting a short passage with a link back is fine and
          welcome.
        </p>
      </section>

      <section>
        <h2>Accuracy and no warranty</h2>
        <p>
          Tutorials are written against a specific version of each product at a specific point in
          time. Software changes — menus move, features get renamed, entire settings pages get
          redesigned. A guide that was accurate when published may not match what you see today.
        </p>
        <p>
          This site is provided &quot;as is&quot;, without warranty of any kind. {SITE_OWNER} does not
          guarantee that any tutorial is complete, current, or suitable for your particular
          situation. You use the instructions at your own risk, and you are responsible for verifying
          that an action is safe before taking it on your own accounts or data.
        </p>
      </section>

      <section>
        <h2>Not professional advice</h2>
        <p>
          Some tutorials cover accounting, tax, e-commerce, and trading software. They explain how to
          operate the software. They are not financial, tax, legal, or investment advice, and should
          not be treated as such. Before making decisions with financial or legal consequences,
          consult a qualified professional.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE_OWNER} is not liable for any loss or damage
          arising from your use of this site or reliance on its content — including lost data, lost
          revenue, account restrictions, or business interruption.
        </p>
      </section>

      <section>
        <h2>Trademarks and affiliation</h2>
        <p>
          Product names, logos, and brands mentioned on this site are the property of their
          respective owners. {SITE_NAME} is independent and is not affiliated with, endorsed by, or
          sponsored by any of those companies. Names are used only to identify the software each
          tutorial covers.
        </p>
      </section>

      <section>
        <h2>Third-party content</h2>
        <p>
          Tutorial pages link to external websites, including the official sites of the software
          covered. Those services have their own terms and policies, and this site has no control
          over their content or availability.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          These terms may be updated; the date at the top reflects the current version. Questions
          about anything here can go to <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.
        </p>
        <p>
          Related: <Link href="/privacy">Privacy Policy</Link> ·{" "}
          <Link href="/contact">Contact</Link>
        </p>
      </section>
    </ProsePage>
  );
}
