import type { Metadata } from "next";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { TOOLS } from "@/lib/constants";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Finance calculators",
  description:
    "Eight free, instant-calculation tools for Indian investors — SIP, EMI, FD, tax, retirement, and more. No signup, no ads, just answers.",
  alternates: { canonical: "/tools" },
  openGraph: {
    type: "website",
    title: "Finance calculators — Compound",
    description:
      "Instant calculators for SIP, EMI, FD, tax, retirement, CAGR, and more. No signup, no ads.",
  },
};

export const revalidate = 86400;

export default function ToolsHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ])}
      />
      <Container className="py-14">
        <SectionHeading
          as="h1"
          eyebrow="Calculators"
          title="Run the numbers"
          description="Every tool calculates instantly as you type. URLs are shareable — copy any one to send a scenario to a friend."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-5 transition-colors hover:border-accent"
            >
              <span className="grid size-11 place-items-center rounded-(--radius) bg-accent/10 text-accent-ink">
                <DynamicIcon name={tool.icon} className="size-5" />
              </span>
              <h3 className="font-display text-lg font-semibold">{tool.name}</h3>
              <p className="text-sm text-muted">{tool.description}</p>
              <span className="mt-auto text-xs font-medium text-accent-ink">
                Open calculator →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
