import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Avatar } from "@/components/ui/avatar";
import { ArticleCard } from "@/components/blog/article-card";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { XIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { Globe } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllAuthorSlugs,
  getAuthor,
  getPostsByAuthor,
} from "@/lib/content";
import { breadcrumbSchema, personSchema } from "@/lib/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllAuthorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return {
    title: author.frontmatter.name,
    description: author.frontmatter.bio,
    alternates: { canonical: `/author/${author.slug}` },
    openGraph: {
      type: "profile",
      title: `${author.frontmatter.name} — ${author.frontmatter.role}`,
      description: author.frontmatter.bio,
    },
  };
}

const LINK_BTN =
  "inline-flex size-9 items-center justify-center rounded-(--radius) border border-border text-muted transition-colors hover:bg-surface hover:text-foreground";

export const revalidate = 3600;

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const posts = getPostsByAuthor(slug);
  const { name, role, avatar, bio, twitter, linkedin, website } = author.frontmatter;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Authors", url: "/blog" },
            { name, url: `/author/${author.slug}` },
          ]),
          personSchema(author),
        ]}
      />
      <Container className="py-14">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Authors" },
            { name },
          ]}
        />
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar name={name} src={avatar} size={96} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">
              {role}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{name}</h1>
            <p className="mt-2 max-w-2xl text-muted">{bio}</p>
            {(twitter || linkedin || website) && (
              <div className="mt-4 flex gap-2">
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label={`${name} on X`} className={LINK_BTN}>
                    <XIcon className="size-4" />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`} className={LINK_BTN}>
                    <LinkedInIcon className="size-4" />
                  </a>
                )}
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s website`} className={LINK_BTN}>
                    <Globe className="size-4" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
