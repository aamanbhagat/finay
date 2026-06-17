import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorLayout } from "@/components/tools/calculator-layout";
import { Faq } from "@/components/tools/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { CALCULATOR_COMPONENTS } from "@/components/tools/registry";
import { TOOLS, getTool } from "@/lib/constants";
import { TOOL_FAQS } from "@/lib/tool-faqs";
import {
  breadcrumbSchema,
  faqSchema,
  webApplicationSchema,
} from "@/lib/schema";

interface PageProps {
  params: Promise<{ tool: string }>;
}

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool } = await params;
  const t = getTool(tool);
  if (!t) return {};
  // Pad to the SEO-friendly 120–160 char band so SERP snippets don't get cut short.
  const description =
    `${t.description} Free, instant, no signup — shareable URL. Designed for Indian investors (₹, FY 2025-26).`.slice(0, 200);
  return {
    title: t.name,
    description,
    alternates: { canonical: `/tools/${t.slug}` },
    openGraph: { type: "website", title: t.name, description, url: `/tools/${t.slug}` },
    twitter: { card: "summary_large_image", title: t.name, description },
  };
}

export const revalidate = 86400;

export default async function ToolPage({ params }: PageProps) {
  const { tool } = await params;
  const t = getTool(tool);
  const Calculator = CALCULATOR_COMPONENTS[tool];
  if (!t || !Calculator) notFound();

  const faqs = TOOL_FAQS[tool] ?? [];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tools", url: "/tools" },
            { name: t.name, url: `/tools/${t.slug}` },
          ]),
          webApplicationSchema(t.name, t.description, `/tools/${t.slug}`),
          ...(faqs.length ? [faqSchema(faqs)] : []),
        ]}
      />
      <CalculatorLayout
        slug={t.slug}
        name={t.name}
        description={t.description}
        faq={faqs.length > 0 ? <Faq items={faqs} /> : undefined}
      >
        <Calculator />
      </CalculatorLayout>
    </>
  );
}
