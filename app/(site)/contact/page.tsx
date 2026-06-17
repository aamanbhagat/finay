import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";

const TITLE = "Contact Compound";
const DESCRIPTION =
  "Contact the Compound editorial team — story tips, corrections, advertising, press, and security disclosures. We read every message and reply within two business days.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", title: "Contact", description: DESCRIPTION, url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema("ContactPage", { title: TITLE, description: DESCRIPTION, path: "/contact" }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
        ]}
      />
      <ProsePage
        eyebrow="Contact"
        title="Get in touch"
        description="We read every message. Replies tend to land within two business days."
      >
      <h2>Editorial</h2>
      <p>
        Story tips, corrections, and feedback: <a href="mailto:editor@compound.example">editor@compound.example</a>.
      </p>
      <h2>Advertising & sponsorships</h2>
      <p>
        For sponsorship inquiries see our <a href="/advertise">advertise page</a> or write to{" "}
        <a href="mailto:partnerships@compound.example">partnerships@compound.example</a>.
      </p>
      <h2>Press</h2>
      <p>
        Interview requests and press inquiries:{" "}
        <a href="mailto:press@compound.example">press@compound.example</a>.
      </p>
      <h2>Security</h2>
      <p>
        Found a security issue? Email{" "}
        <a href="mailto:security@compound.example">security@compound.example</a>. Please don't
        publicly disclose vulnerabilities until we've had a chance to respond.
      </p>
      </ProsePage>
    </>
  );
}
