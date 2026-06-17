import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SearchClient } from "@/components/search/search-client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search all articles on Compound by topic, tag, or keyword.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  return (
    <Container className="py-14">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">Search</p>
      <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">Find an article</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Type a topic, tag, or company. Search runs entirely in your browser.
      </p>
      <div className="mt-8 max-w-3xl">
        <SearchClient initialQuery={q} />
      </div>
    </Container>
  );
}
