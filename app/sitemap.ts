import type { MetadataRoute } from "next";
import {
  getAllAuthorSlugs,
  getAllPosts,
  getAllTags,
} from "@/lib/content";
import { CATEGORIES, SITE, TOOLS } from "@/lib/constants";
import { absoluteImage } from "@/lib/utils";

const STATIC_ROUTES = [
  "/",
  "/blog",
  "/tools",
  "/newsletter",
  "/about",
  "/contact",
  "/advertise",
  "/privacy-policy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url.replace(/\/$/, "");
  const posts = getAllPosts();

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const postEntries = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.updatedAt ?? post.frontmatter.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
    images: post.frontmatter.cover ? [absoluteImage(post.frontmatter.cover)] : undefined,
  }));

  const categoryEntries = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tagEntries = getAllTags().map((t) => ({
    url: `${base}/tag/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const authorEntries = getAllAuthorSlugs().map((slug) => ({
    url: `${base}/author/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const toolEntries = TOOLS.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...postEntries,
    ...categoryEntries,
    ...tagEntries,
    ...authorEntries,
    ...toolEntries,
  ];
}
