/**
 * Validate + publish. Assembles frontmatter the bot fully controls, validates it
 * against the SAME Zod schema the site uses at build time (single source of
 * truth), guarantees a unique slug, and writes the .mdx file to content/blog.
 */
import fs from "node:fs";
import matter from "gray-matter";
import readingTime from "reading-time";
import { BLOG_DIR, AUTHOR_BY_CATEGORY, COVERS_BY_CATEGORY, USE_COVERS } from "./config";
import { postFrontmatterSchema } from "../lib/validators";
import { generateImages } from "./images";
import type { ContentBrief } from "./types";

export interface PublishResult {
  slug: string;
  filePath: string;
  wordCount: number;
  author: string;
}

function clampDescription(desc: string, fallback: string): string {
  let d = (desc ?? "").trim().replace(/\s+/g, " ");
  if (d.length > 200) d = `${d.slice(0, 197).trimEnd()}…`;
  if (d.length < 50) d = `${d} ${fallback}`.trim().slice(0, 200);
  if (d.length < 50) d = `A practical guide for Indian investors: ${d}`.slice(0, 200);
  return d;
}

function ensureUniqueSlug(slug: string): string {
  let candidate = slug || "untitled";
  let n = 2;
  while (fs.existsSync(`${BLOG_DIR}/${candidate}.mdx`)) {
    candidate = `${slug}-${n++}`;
  }
  return candidate;
}

function pickCover(category: ContentBrief["category"], seed: number): string | undefined {
  if (!USE_COVERS) return undefined;
  const pool = COVERS_BY_CATEGORY[category];
  if (!pool?.length) return undefined;
  return pool[seed % pool.length];
}

/** Insert the inline figure block right after the intro (before the first H2). */
function injectFigure(body: string, figureBlock: string): string {
  if (!figureBlock) return body;
  const idx = body.indexOf("\n## ");
  if (idx === -1) return `${body}\n${figureBlock}`;
  return `${body.slice(0, idx)}\n${figureBlock}${body.slice(idx)}`;
}

export async function publishArticle(
  brief: ContentBrief,
  body: string,
): Promise<PublishResult> {
  const slug = ensureUniqueSlug(brief.slug);
  const author = AUTHOR_BY_CATEGORY[brief.category] ?? "aarav-mehta";
  const today = new Date().toISOString().slice(0, 10);

  // Generate branded cover + optional inline figure. Fall back to a curated
  // Unsplash cover only if generation fails for any reason.
  let cover: string | undefined;
  let coverAlt = `Illustration for ${brief.title}`;
  let finalBody = body;
  try {
    const imgs = await generateImages(brief, slug);
    cover = imgs.cover;
    coverAlt = imgs.coverAlt;
    finalBody = injectFigure(body, imgs.figureBlock);
  } catch (err) {
    console.warn(`  ⚠ image generation failed (${err instanceof Error ? err.message : err}); using fallback cover.`);
    cover = pickCover(brief.category, slug.length);
  }

  const frontmatter = {
    title: brief.title.slice(0, 120),
    description: clampDescription(brief.description, brief.angle),
    category: brief.category,
    tags: brief.tags.length ? brief.tags : ["Investing"],
    author,
    publishedAt: today,
    status: "published" as const,
    featured: false,
    sponsored: false,
    ...(cover ? { cover, coverAlt } : {}),
  };

  // Validate against the real site schema — fail loudly before writing junk.
  const parsed = postFrontmatterSchema.safeParse(frontmatter);
  if (!parsed.success) {
    throw new Error(`Generated frontmatter is invalid:\n${parsed.error.message}`);
  }

  const fileContents = matter.stringify(`\n${finalBody}\n`, frontmatter);
  const filePath = `${BLOG_DIR}/${slug}.mdx`;
  fs.writeFileSync(filePath, fileContents, "utf8");

  return {
    slug,
    filePath,
    author,
    wordCount: readingTime(finalBody).words,
  };
}
