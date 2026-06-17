import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";

const TITLE = "About Compound";
const DESCRIPTION =
  "Compound is independent finance journalism for Indian readers — clear analysis on stocks, crypto, tax, banking, insurance, and personal finance, with the math intact.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { type: "website", title: "About", description: DESCRIPTION, url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema("AboutPage", { title: TITLE, description: DESCRIPTION, path: "/about" }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
        ]}
      />
      <ProsePage
        eyebrow="About"
        title="Money, demystified"
      description="Compound is an independent publication for people who want to understand their money without wading through jargon, paywalls, or sales pitches."
    >
      <p>
        We started Compound because the best financial writing was either locked behind expensive
        subscriptions or buried under thinly veiled advertising. We wanted a place that explained
        money the way you'd explain it to a friend — honestly, with the numbers intact and the
        hype stripped out.
      </p>
      <h2>What we cover</h2>
      <p>
        Our editorial focuses on six areas: <strong>stocks</strong>, <strong>crypto</strong>,{" "}
        <strong>personal finance</strong>, <strong>banking</strong>, <strong>tax</strong>, and{" "}
        <strong>insurance</strong>. Each piece is written by someone who has actually used the
        product or done the math — never auto-generated, never published for SEO alone.
      </p>
      <h2>How we make money</h2>
      <p>
        Compound is reader-supported. We carry a small number of clearly labelled sponsorships and
        affiliate links where they don't compromise our editorial. We never accept payment to write
        about a product, and sponsored content is always marked as such — both visually and in
        structured data.
      </p>
      <h2>Our principles</h2>
      <ul>
        <li>Show the numbers. If an article makes a claim, the math is in the article.</li>
        <li>No hype cycles. We're skeptical by default, especially of anything that promises easy returns.</li>
        <li>Reader first. If an advertiser disagrees with our coverage, we keep the coverage.</li>
        <li>Plain language. If a word would lose a smart 18-year-old, we change it.</li>
      </ul>
      <p>
        Have a story tip, correction, or just want to say hi? Find us on the{" "}
        <a href="/contact">contact page</a>.
      </p>
      </ProsePage>
    </>
  );
}
