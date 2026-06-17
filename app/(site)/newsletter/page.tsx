import type { Metadata } from "next";
import { Mail, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";

const TITLE = "The Compound newsletter";
const DESCRIPTION =
  "Join 20,000+ readers getting Compound's five-minute weekly money brief — markets, tax, banking, and one practical move every Sunday. Free, forever, no tracking.";

export const metadata: Metadata = {
  title: "Newsletter",
  description: DESCRIPTION,
  alternates: { canonical: "/newsletter" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/newsletter" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const BENEFITS = [
  "The market moves that mattered — without the noise.",
  "A tax, budgeting, or banking tip you can actually use.",
  "One chart worth your time, with a sentence of context.",
  "No spam, no tracking pixels, unsubscribe with one click.",
];

export default function NewsletterPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema("WebPage", { title: TITLE, description: DESCRIPTION, path: "/newsletter" }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Newsletter", url: "/newsletter" },
          ]),
        ]}
      />
      <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-ink">
          <Mail className="size-3.5" aria-hidden />
          Newsletter
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          The five-minute money brief
        </h1>
        <p className="mt-4 text-lg text-muted">
          Every Sunday: the week in markets, tax, and personal finance — in a single readable
          email. Free, forever.
        </p>
        <div className="mt-8">
          <NewsletterSignup source="newsletter-page" className="mx-auto max-w-md" />
        </div>
      </div>

      <ul className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm"
          >
            <span
              aria-hidden
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-navy"
            >
              <Check className="size-3" />
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted">
        We use your email only to send this newsletter. No third-party sharing, no tracking pixels.
      </p>
      </Container>
    </>
  );
}
