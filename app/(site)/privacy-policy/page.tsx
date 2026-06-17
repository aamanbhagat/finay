import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";

const TITLE = "Privacy policy";
const DESCRIPTION =
  "How Compound handles your data — minimally and transparently. What we collect (email, anonymous analytics), what we don't, and how to request deletion any time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy-policy" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema("WebPage", { title: TITLE, description: DESCRIPTION, path: "/privacy-policy" }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Privacy policy", url: "/privacy-policy" },
          ]),
        ]}
      />
      <ProsePage eyebrow="Legal" title="Privacy policy">
      <p>
        <em>Last updated: {new Date().getFullYear()}.</em>
      </p>
      <p>
        Compound is built to collect as little personal data as possible. This page describes what
        we do collect, why, and how to remove it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Email address</strong> — only if you subscribe to the newsletter, and only to
          deliver it.
        </li>
        <li>
          <strong>Analytics</strong> — aggregate, anonymous page-view data via privacy-first
          analytics. No cookies are set for tracking.
        </li>
        <li>
          <strong>Comments</strong> — your chosen display name and the comment text. We don't
          require account creation.
        </li>
      </ul>
      <h2>What we don't do</h2>
      <ul>
        <li>We don't sell, rent, or share your email or personal data.</li>
        <li>We don't set third-party advertising cookies.</li>
        <li>We don't run user-tracking pixels in newsletters.</li>
      </ul>
      <h2>Your rights</h2>
      <p>
        You can unsubscribe from the newsletter at any time using the link in every email, or write
        to <a href="mailto:privacy@compound.example">privacy@compound.example</a> to request that
        your data be deleted.
      </p>
      <h2>Changes</h2>
      <p>
        We'll update this page when our practices change. Material changes will be announced in the
        newsletter.
      </p>
      </ProsePage>
    </>
  );
}
