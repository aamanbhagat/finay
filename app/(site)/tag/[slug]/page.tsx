import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ArticleCard } from "@/components/blog/article-card";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getAllTags().find((t) => t.slug === slug);
  if (!tag) return {};
  const description =
    `${tag.count} article${tag.count === 1 ? "" : "s"} on ${tag.tag} from Compound — clear, India-focused analysis on stocks, crypto, tax, banking, and personal finance.`;
  return {
    title: `#${tag.tag}`,
    description,
    alternates: { canonical: `/tag/${tag.slug}` },
    openGraph: { type: "website", title: `#${tag.tag}`, description, url: `/tag/${tag.slug}` },
  };
}

export const revalidate = 3600;

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tagInfo = getAllTags().find((t) => t.slug === slug);
  if (!tagInfo) notFound();

  const posts = getPostsByTag(slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tags", url: "/blog" },
            { name: tagInfo.tag, url: `/tag/${tagInfo.slug}` },
          ]),
          collectionPageSchema(`#${tagInfo.tag} — Compound`, `/tag/${tagInfo.slug}`, posts),
        ]}
      />
      <Container className="py-14">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: `#${tagInfo.tag}` },
          ]}
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-accent-ink">Tag</p>
        <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">#{tagInfo.tag}</h1>
        <p className="mt-2 text-sm text-muted">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </>
  );
}
