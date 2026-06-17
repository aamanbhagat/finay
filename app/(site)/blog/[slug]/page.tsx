import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CalendarDays, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { ReadingProgressBar } from "@/components/blog/reading-progress-bar";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Reactions } from "@/components/blog/reactions";
import { AuthorCard } from "@/components/blog/author-card";
import { ArticleCard } from "@/components/blog/article-card";
import { NewsletterInline } from "@/components/blog/newsletter-inline";
import { MdxContent } from "@/components/mdx/mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAllPostSlugs,
  getAuthor,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/content";
import { BLUR_DATA_URL, getCategory, SITE } from "@/lib/constants";
import { absoluteUrl, formatDate, slugify, toISODate } from "@/lib/utils";
import { articleSchema, breadcrumbSchema, personSchema } from "@/lib/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { title, description, cover, coverAlt, publishedAt, updatedAt, tags, author } =
    post.frontmatter;
  const authorData = getAuthor(author);
  const url = `/blog/${post.slug}`;
  const ogParams = new URLSearchParams({ title });
  if (authorData) ogParams.set("author", authorData.frontmatter.name);
  ogParams.set("category", post.frontmatter.category);
  const ogImage = cover ?? `/api/og?${ogParams.toString()}`;
  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: toISODate(publishedAt),
      modifiedTime: toISODate(updatedAt ?? publishedAt),
      authors: authorData ? [authorData.frontmatter.name] : [SITE.name],
      tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: coverAlt ?? title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export const revalidate = 3600;

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.frontmatter.author);
  const category = getCategory(post.frontmatter.category);
  const related = getRelatedPosts(post, 3);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <ReadingProgressBar />
      <JsonLd
        data={[
          articleSchema(post, author),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            ...(category
              ? [{ name: category.name, url: `/blog?category=${category.slug}` }]
              : []),
            { name: post.frontmatter.title, url: `/blog/${post.slug}` },
          ]),
          ...(author ? [personSchema(author)] : []),
        ]}
      />

      <article className="pb-16">
        <header className="relative border-b border-border bg-surface/40">
          <div className="ledger-grid absolute inset-0 opacity-40" aria-hidden />
          <Container className="relative py-14 lg:py-20">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Blog", href: "/blog" },
                ...(category
                  ? [{ name: category.name, href: `/blog?category=${category.slug}` }]
                  : []),
                { name: post.frontmatter.title },
              ]}
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CategoryBadge slug={post.frontmatter.category} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Featured story
              </span>
              {post.frontmatter.sponsored && (
                <span className="inline-flex items-center rounded-full bg-navy px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                  Sponsored
                </span>
              )}
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-tight">
              {post.frontmatter.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted lg:text-xl">
              {post.frontmatter.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              {author && (
                <Link href={`/author/${author.slug}`} className="inline-flex items-center gap-2.5 group">
                  <Avatar name={author.frontmatter.name} src={author.frontmatter.avatar} size={36} />
                  <span className="flex flex-col leading-tight">
                    <span className="font-medium text-foreground transition-colors group-hover:text-accent-ink">
                      {author.frontmatter.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                      {author.frontmatter.role}
                    </span>
                  </span>
                </Link>
              )}
              <span className="h-6 w-px bg-border" aria-hidden />
              <span className="inline-flex items-center gap-1.5 text-muted">
                <CalendarDays className="size-4" aria-hidden />
                <time dateTime={toISODate(post.frontmatter.publishedAt)}>
                  {formatDate(post.frontmatter.publishedAt)}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted">
                <Clock className="size-3.5" aria-hidden />
                {post.readingTimeMinutes} min
              </span>
            </div>
          </Container>
        </header>

        {post.frontmatter.cover && (
          <Container className="mt-8">
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-lg border border-border bg-surface">
              <Image
                src={post.frontmatter.cover}
                alt={post.frontmatter.coverAlt ?? post.frontmatter.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
          </Container>
        )}

        <Container className="mt-10 grid gap-10 lg:grid-cols-[1fr_220px]">
          <div className="min-w-0">
            <div className="prose prose-neutral prose-drop-cap max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-3xl prose-h3:text-xl prose-p:leading-[1.75] prose-p:text-foreground/90 prose-a:text-accent-ink prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-l-gold prose-blockquote:bg-surface prose-blockquote:py-2 prose-blockquote:not-italic prose-strong:text-foreground">
              <MdxContent source={post.content} />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="size-4 text-muted" aria-hidden />
                {post.frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${slugify(tag)}`}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Reactions slug={post.slug} />
                <ShareButtons url={url} title={post.frontmatter.title} />
              </div>
            </div>

            {author && (
              <div className="mt-10">
                <AuthorCard author={author} />
              </div>
            )}

            <div className="mt-10">
              <NewsletterInline
                heading="Read like this every week"
                body="Get our best analysis and one practical money move in your inbox every Sunday."
                source="article-end"
              />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={post.toc} />
            </div>
          </aside>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface/40">
          <Container className="py-14">
            <SectionHeading eyebrow="Keep reading" title="Related articles" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
