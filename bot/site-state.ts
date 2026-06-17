/**
 * Reads the live site straight from disk (NOT via lib/content.ts, which is
 * `server-only` and would throw outside Next). Produces the SiteState snapshot
 * the strategy brain reasons over.
 */
import fs from "node:fs";
import matter from "gray-matter";
import { BLOG_DIR } from "./config";
import { CATEGORIES, type CategorySlug } from "../lib/constants";
import { slugify } from "../lib/utils";
import type { SiteState } from "./types";

interface RawPost {
  slug: string;
  title: string;
  category: CategorySlug;
  tags: string[];
  publishedAt: string;
  status: string;
}

function readPosts(): RawPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(`${BLOG_DIR}/${file}`, "utf8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: String(data.title ?? ""),
        category: data.category as CategorySlug,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        publishedAt: String(data.publishedAt ?? ""),
        status: String(data.status ?? "published"),
      };
    });
}

const DAY = 86_400_000;

export function readSiteState(siteBirthOverride: string | null): SiteState {
  const posts = readPosts();

  const dates = posts
    .map((p) => new Date(p.publishedAt).getTime())
    .filter((t) => Number.isFinite(t));
  const earliest = dates.length ? Math.min(...dates) : Date.now();
  const siteBirth = siteBirthOverride ?? new Date(earliest).toISOString().slice(0, 10);
  const ageDays = Math.max(0, Math.floor((Date.now() - new Date(siteBirth).getTime()) / DAY));

  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, 0]),
  ) as Record<CategorySlug, number>;
  const tagCounts: Record<string, number> = {};

  for (const p of posts) {
    if (categoryCounts[p.category] !== undefined) categoryCounts[p.category]++;
    for (const t of p.tags) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  }

  const weakestCategories = (Object.keys(categoryCounts) as CategorySlug[]).sort(
    (a, b) => categoryCounts[a] - categoryCounts[b],
  );

  const emergingClusters = Object.entries(tagCounts)
    .filter(([, n]) => n >= 2 && n <= 4)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const sortedByDate = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    totalPosts: posts.length,
    siteBirth,
    ageDays,
    slugs: posts.map((p) => p.slug),
    titles: posts.map((p) => p.title),
    recentTitles: sortedByDate.slice(0, 12).map((p) => p.title),
    categoryCounts,
    tagCounts,
    weakestCategories,
    emergingClusters,
  };
}

/** Cheap token-overlap similarity (Jaccard) for dedupe guards. */
export function titleSimilarity(a: string, b: string): number {
  const toks = (s: string) =>
    new Set(
      slugify(s)
        .split("-")
        .filter((w) => w.length > 2),
    );
  const sa = toks(a);
  const sb = toks(b);
  if (!sa.size || !sb.size) return 0;
  let shared = 0;
  for (const t of sa) if (sb.has(t)) shared++;
  return shared / new Set([...sa, ...sb]).size;
}
