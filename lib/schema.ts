import type { Post, Author } from "@/lib/content";
import { SITE, getCategory } from "@/lib/constants";
import { absoluteUrl, absoluteImage, toISODate } from "@/lib/utils";

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon.png"),
    sameAs: [
      "https://twitter.com/compound",
      "https://linkedin.com/company/compound",
    ],
  };
}

/**
 * Generic WebPage / AboutPage / ContactPage schema for static pages.
 * Pair with a breadcrumbSchema() call to get Google's site-name breadcrumb.
 */
export function pageSchema(
  pageType: "WebPage" | "AboutPage" | "ContactPage",
  args: { title: string; description: string; path: string },
) {
  const url = absoluteUrl(args.path);
  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${url}#page`,
    url,
    name: args.title,
    description: args.description,
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}

export function personSchema(author: Author) {
  const links = [author.frontmatter.twitter, author.frontmatter.linkedin, author.frontmatter.website]
    .filter(Boolean)
    .map(String);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl(`/author/${author.slug}#person`),
    name: author.frontmatter.name,
    jobTitle: author.frontmatter.role,
    description: author.frontmatter.bio,
    url: absoluteUrl(`/author/${author.slug}`),
    ...(links.length ? { sameAs: links } : {}),
  };
}

export function articleSchema(post: Post, author?: Author) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = post.frontmatter.cover
    ? [absoluteImage(post.frontmatter.cover)]
    : [absoluteUrl(`/api/og?title=${encodeURIComponent(post.frontmatter.title)}`)];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image,
    datePublished: toISODate(post.frontmatter.publishedAt),
    dateModified: toISODate(post.frontmatter.updatedAt ?? post.frontmatter.publishedAt),
    articleSection: getCategory(post.frontmatter.category)?.name,
    keywords: post.frontmatter.tags.join(", "),
    author: author
      ? { "@id": absoluteUrl(`/author/${author.slug}#person`), "@type": "Person", name: author.frontmatter.name }
      : { "@type": "Organization", name: SITE.name },
    publisher: { "@id": ORG_ID },
    wordCount: post.wordCount,
    isAccessibleForFree: true,
  };
}

export function collectionPageSchema(name: string, path: string, posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: absoluteUrl(path),
    isPartOf: { "@id": SITE_ID },
    hasPart: posts.slice(0, 20).map((post) => ({
      "@type": "Article",
      headline: post.frontmatter.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: toISODate(post.frontmatter.publishedAt),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function webApplicationSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    isPartOf: { "@id": SITE_ID },
  };
}
