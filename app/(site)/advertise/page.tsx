import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";

const TITLE = "Advertise on Compound";
const DESCRIPTION =
  "Sponsor the Compound newsletter or run a clearly-labelled site placement. Reach 20,000+ engaged Indian investors aged 25–45 with strong open and click rates.";

export const metadata: Metadata = {
  title: "Advertise",
  description: DESCRIPTION,
  alternates: { canonical: "/advertise" },
  openGraph: { type: "website", title: "Advertise", description: DESCRIPTION, url: "/advertise" },
};

export default function AdvertisePage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema("WebPage", { title: TITLE, description: DESCRIPTION, path: "/advertise" }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Advertise", url: "/advertise" },
          ]),
        ]}
      />
      <ProsePage
        eyebrow="Advertise"
        title="Reach engaged Indian investors"
        description="Compound is read by 20,000+ subscribers who care enough about money to read a 5-minute brief every week. If your product genuinely helps them, we'd like to talk."
      >
      <h2>What we offer</h2>
      <ul>
        <li>
          <strong>Newsletter sponsorship</strong> — a single brand mention at the top of the
          weekly brief, written in our voice.
        </li>
        <li>
          <strong>Article sponsorship</strong> — clearly labelled, with our standard editorial
          standards and a "no veto on content" clause.
        </li>
        <li>
          <strong>Tools placement</strong> — for finance products where context fits (e.g. a fund
          manager near the SIP calculator).
        </li>
      </ul>
      <h2>What we won't do</h2>
      <ul>
        <li>Pretend sponsored content is editorial. All placements are visually labelled.</li>
        <li>Promote products that mislead readers, including high-risk derivatives marketed as "easy money".</li>
        <li>Let advertisers veto coverage.</li>
      </ul>
      <h2>Audience snapshot</h2>
      <ul>
        <li>20,000+ newsletter subscribers</li>
        <li>~80% based in India, primarily 25–45 years old</li>
        <li>Median open rate ~46%, click rate ~7%</li>
      </ul>
      <p>
        Write to <a href="mailto:partnerships@compound.example">partnerships@compound.example</a>{" "}
        with a brief on what you'd like to promote. We'll reply with rates and availability.
      </p>
      </ProsePage>
    </>
  );
}
