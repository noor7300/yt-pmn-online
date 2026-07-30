import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { SITE_NAME, SITE_URL, SITE_OWNER, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data, cookies, analytics, and third-party advertising.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy Policy"
      updated="July 30, 2026"
      intro={`This policy explains what data is collected when you visit ${SITE_NAME} (${SITE_URL}), who processes it, and the choices you have.`}
    >
      <section>
        <h2>Who is responsible</h2>
        <p>
          This website is operated by {SITE_OWNER}. For any privacy question or request, email{" "}
          <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>Information you give directly</h2>
        <p>
          This site has no accounts, no logins, no newsletter, and no contact forms. There is nothing
          to sign up for and no personal details are requested from you anywhere on the site.
        </p>
        <p>
          If you choose to email me, I receive whatever you put in that email — your address and the
          content of your message. That is used only to reply to you and is not added to any mailing
          list or shared with anyone.
        </p>
      </section>

      <section>
        <h2>Information collected automatically</h2>
        <p>
          <strong>Analytics.</strong> This site uses Vercel Web Analytics to understand which pages
          get visited. It records page paths, referrers, and general device and country information.
          It does not use cookies and does not build a cross-site profile of you or identify you
          personally. See{" "}
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel&apos;s analytics privacy documentation
          </a>
          .
        </p>
        <p>
          <strong>Hosting logs.</strong> The site is hosted on Vercel, which processes standard
          server request data (IP address, user agent, timestamp) as part of delivering the site and
          protecting it from abuse.
        </p>
      </section>

      <section>
        <h2>Embedded videos</h2>
        <p>
          Every tutorial page embeds a video hosted on YouTube. The video does not load until you
          click play — until then, only a still thumbnail image is shown.
        </p>
        <p>
          Once you press play, YouTube (Google) loads its player and may set cookies and collect data
          according to its own policies, exactly as if you had visited YouTube directly. That
          processing is controlled by Google, not by this site. See the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Advertising</h2>
        <p>
          This site may display advertising served by Google, including Google AdSense, and by other
          third-party advertising vendors.
        </p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on your prior
            visits to this website or other websites.
          </li>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to you
            based on your visit to this site and/or other sites on the internet.
          </li>
          <li>
            You can opt out of personalised advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            You can opt out of some third-party vendors&apos; use of cookies for personalised
            advertising at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info/choices
            </a>{" "}
            or{" "}
            <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
              optout.networkadvertising.org
            </a>
            .
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          This site sets no cookies of its own. Cookies you may encounter here come from third-party
          services described above — the YouTube player once a video is played, and advertising
          vendors where ads are shown. You can block or delete cookies in your browser settings,
          though blocking them may affect how embedded videos behave.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Depending on where you live — for example under the GDPR in the EU/UK, or the CCPA in
          California — you may have the right to access, correct, or delete personal data held about
          you, and to object to certain processing.
        </p>
        <p>
          Because this site collects no personal data directly and stores no user records, there is
          usually nothing held here to retrieve or delete. For data held by Google or other third
          parties through their cookies, those requests need to go to them directly. If you have a
          question about any of this, email{" "}
          <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> and I&apos;ll help where I can.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          This site is aimed at people using business and productivity software and is not directed
          at children under 13. No personal information is knowingly collected from children.
        </p>
      </section>

      <section>
        <h2>External links</h2>
        <p>
          Tutorials link to third-party websites, including the official sites of the software
          covered. This policy applies only to {SITE_NAME}. Once you follow a link elsewhere, that
          site&apos;s own privacy policy applies.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          If this policy changes — for example when advertising is switched on, or if a new analytics
          tool is added — the date at the top of this page will be updated to reflect it.
        </p>
        <p>
          Related: <Link href="/terms">Terms of Use</Link> ·{" "}
          <Link href="/contact">Contact</Link>
        </p>
      </section>
    </ProsePage>
  );
}
