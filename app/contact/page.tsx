import type { Metadata } from "next";
import { ProsePage } from "@/components/ProsePage";
import { SITE_NAME, SITE_OWNER, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE_NAME} — corrections, tutorial requests, and general enquiries.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ProsePage
      title="Contact"
      intro="Questions, corrections, or a tutorial you'd like to see covered — email is the fastest way to reach me."
    >
      <section>
        <h2>Email</h2>
        <p>
          <a href={`mailto:${SITE_EMAIL}`} className="font-mono">
            {SITE_EMAIL}
          </a>
        </p>
        <p>
          Messages go directly to {SITE_OWNER}. I read everything, though replies can take a few days
          depending on volume.
        </p>
      </section>

      <section>
        <h2>What to write about</h2>
        <ul>
          <li>
            <strong>A step that no longer works.</strong> Software interfaces change constantly. If a
            guide is out of date, tell me which page and what you see instead — this is the most
            useful message you can send.
          </li>
          <li>
            <strong>A tutorial request.</strong> If there&apos;s a task you can&apos;t find covered
            here, send it over. Requests genuinely influence what gets made next.
          </li>
          <li>
            <strong>Corrections.</strong> If something is factually wrong, I want to know and will
            fix it.
          </li>
          <li>
            <strong>Copyright or content concerns.</strong> If you believe something on this site
            infringes your rights, email with the specific URL and details and I&apos;ll respond
            promptly.
          </li>
        </ul>
      </section>

      <section>
        <h2>Before you email</h2>
        <p>
          I can&apos;t provide account-specific support for third-party software. If you&apos;re
          locked out of your Shopify store, your QuickBooks subscription was charged incorrectly, or
          your Google Workspace account is suspended, those need that company&apos;s own support team
          — I have no access to your accounts and no ability to act on them.
        </p>
      </section>
    </ProsePage>
  );
}
