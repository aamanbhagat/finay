import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Container } from "@/components/ui/container";
import { ArticleCard } from "@/components/blog/article-card";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getPostsByCategory } from "@/lib/content";
import { CATEGORIES, getCategory } from "@/lib/constants";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  // Pad to a SERP-friendly length while keeping the original taxonomy line first.
  const description =
    `${category.description} Every Compound piece on ${category.name.toLowerCase()} — analysis, explainers, and India-specific guidance.`;
  return {
    title: `${category.name} articles`,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      type: "website",
      title: `${category.name} articles`,
      description,
      url: `/category/${category.slug}`,
    },
    twitter: { card: "summary_large_image", title: `${category.name} articles`, description },
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(category.slug);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Categories", url: "/blog" },
            { name: category.name, url: `/category/${category.slug}` },
          ]),
          collectionPageSchema(`${category.name} — Compound`, `/category/${category.slug}`, posts),
        ]}
      />
      <Container className="py-14">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Categories", href: "/blog" },
            { name: category.name },
          ]}
        />
        <div className="mt-6 flex items-center gap-4">
          <span
            aria-hidden
            className="grid size-14 place-items-center rounded-lg"
            style={{
              color: category.accent,
              backgroundColor: `color-mix(in oklab, ${category.accent} 14%, transparent)`,
            }}
          >
            <DynamicIcon name={category.icon} className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">
              Category
            </p>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{category.name}</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-muted">{category.description}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="col-span-full rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
              No articles yet in this category. Check back soon.
            </p>
          ) : (
            posts.map((post) => <ArticleCard key={post.slug} post={post} />)
          )}
        </div>
      </Container>
    </>
  );
}
