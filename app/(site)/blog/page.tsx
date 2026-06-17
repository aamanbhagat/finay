import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogFilters } from "@/components/blog/blog-filters";
import { ArticleCard } from "@/components/blog/article-card";
import { Pagination } from "@/components/blog/pagination";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPosts, getPostsByCategory } from "@/lib/content";
import { CATEGORY_SLUGS, POSTS_PER_PAGE, getCategory } from "@/lib/constants";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema";

interface SearchParams {
  category?: string;
  page?: string;
}

export const revalidate = 3600;

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  return searchParams.then((sp) => {
    const category = sp.category ? getCategory(sp.category) : undefined;
    const title = category ? `${category.name} articles` : "All articles";
    const description = category
      ? `Latest writing on ${category.name.toLowerCase()} — ${category.description}`
      : "Latest articles on stocks, crypto, personal finance, banking, tax, and insurance from the Compound editorial team.";
    return {
      title,
      description,
      alternates: { canonical: category ? `/blog?category=${category.slug}` : "/blog" },
      openGraph: { title, description, type: "website" },
    };
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  if (sp.category && !CATEGORY_SLUGS.includes(sp.category as never)) notFound();

  const posts = sp.category ? getPostsByCategory(sp.category) : getAllPosts();
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = posts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  const hrefForPage = (n: number) => {
    const params = new URLSearchParams();
    if (sp.category) params.set("category", sp.category);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const category = sp.category ? getCategory(sp.category) : undefined;
  const heading = category ? `${category.name}` : "The Compound archive";
  const description = category
    ? category.description
    : "Every article we've published, newest first. Filter by topic or dive into a category.";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            ...(category ? [{ name: category.name, url: `/blog?category=${category.slug}` }] : []),
          ]),
          collectionPageSchema(`${heading} · Compound`, "/blog", visible),
        ]}
      />
      <Container className="py-14 lg:py-16">
        <SectionHeading
          as="h1"
          eyebrow={category ? "Category" : "All articles"}
          title={heading}
          description={description}
        />

        <BlogFilters current={sp.category} />

        {visible.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
            No articles yet in this category. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <Pagination page={safePage} totalPages={totalPages} hrefForPage={hrefForPage} />
      </Container>
    </>
  );
}
