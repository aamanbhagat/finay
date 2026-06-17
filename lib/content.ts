import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import {
  postFrontmatterSchema,
  authorFrontmatterSchema,
  type PostFrontmatter,
  type AuthorFrontmatter,
} from "@/lib/validators";
import { slugify } from "@/lib/utils";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const AUTHORS_DIR = path.join(process.cwd(), "content", "authors");

export interface TocItem {
  depth: 2 | 3;
  text: string;
  slug: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTimeMinutes: number;
  wordCount: number;
  toc: TocItem[];
}

export interface Author {
  slug: string;
  frontmatter: AuthorFrontmatter;
  content: string;
}

export interface TagInfo {
  tag: string;
  slug: string;
  count: number;
}

function readMdxFiles(dir: string): { slug: string; raw: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.mdx?$/, ""),
      raw: fs.readFileSync(path.join(dir, file), "utf8"),
    }));
}

/** Pull h2/h3 headings (ignoring fenced code) and match rehype-slug anchors. */
function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[*_`]/g, "").trim();
    items.push({ depth: match[1].length as 2 | 3, text, slug: slugger.slug(text) });
  }
  return items;
}

let postCache: Post[] | null = null;

function loadAllPosts(): Post[] {
  if (postCache) return postCache;
  const posts = readMdxFiles(BLOG_DIR).map(({ slug, raw }) => {
    const { data, content } = matter(raw);
    const parsed = postFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid frontmatter in content/blog/${slug}.mdx: ${parsed.error.message}`);
    }
    const stats = readingTime(content);
    return {
      slug,
      frontmatter: parsed.data,
      content,
      readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
      toc: extractToc(content),
    } satisfies Post;
  });
  postCache = posts;
  return posts;
}

function isLive(post: Post): boolean {
  return (
    post.frontmatter.status === "published" &&
    new Date(post.frontmatter.publishedAt).getTime() <= Date.now()
  );
}

function byDateDesc(a: Post, b: Post): number {
  return (
    new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime()
  );
}

/** All publicly visible posts, newest first. */
export function getAllPosts(): Post[] {
  return loadAllPosts().filter(isLive).sort(byDateDesc);
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadAllPosts().find((p) => p.slug === slug && isLive(p));
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getFeaturedPosts(limit = 3): Post[] {
  const featured = getAllPosts().filter((p) => p.frontmatter.featured);
  return (featured.length ? featured : getAllPosts()).slice(0, limit);
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.category === category);
}

export function getPostsByTag(tagSlug: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.tags.some((t) => slugify(t) === tagSlug));
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.author === authorSlug);
}

/** Tags with usage counts, most-used first. */
export function getAllTags(): TagInfo[] {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags) {
      const slug = slugify(tag);
      const existing = counts.get(slug);
      counts.set(slug, { tag, count: (existing?.count ?? 0) + 1 });
    }
  }
  return [...counts.entries()]
    .map(([slug, { tag, count }]) => ({ slug, tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Related posts scored by shared category (2pts) + shared tags (1pt each). */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = p.frontmatter.category === post.frontmatter.category ? 2 : 0;
      score += p.frontmatter.tags.filter((t) => post.frontmatter.tags.includes(t)).length;
      return { post: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || byDateDesc(a.post, b.post))
    .slice(0, limit)
    .map((x) => x.post);
}

// ── Authors ──────────────────────────────────────────────────────────────

let authorCache: Author[] | null = null;

function loadAllAuthors(): Author[] {
  if (authorCache) return authorCache;
  authorCache = readMdxFiles(AUTHORS_DIR).map(({ slug, raw }) => {
    const { data, content } = matter(raw);
    const parsed = authorFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid frontmatter in content/authors/${slug}.mdx: ${parsed.error.message}`);
    }
    return { slug, frontmatter: parsed.data, content } satisfies Author;
  });
  return authorCache;
}

export function getAllAuthors(): Author[] {
  return loadAllAuthors();
}

export function getAuthor(slug: string): Author | undefined {
  return loadAllAuthors().find((a) => a.slug === slug);
}

export function getAllAuthorSlugs(): string[] {
  return loadAllAuthors().map((a) => a.slug);
}
