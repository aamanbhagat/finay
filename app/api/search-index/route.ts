import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";

/** Lightweight JSON index for client-side Fuse.js search. */
export function GET() {
  const index = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    category: post.frontmatter.category,
    tags: post.frontmatter.tags,
    author: post.frontmatter.author,
    publishedAt: post.frontmatter.publishedAt,
  }));
  return NextResponse.json(index, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
