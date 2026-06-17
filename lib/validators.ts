import { z } from "zod";
import { CATEGORY_SLUGS } from "@/lib/constants";

/** Frontmatter contract for every MDX article. Validated at parse time. */
export const postFrontmatterSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(50).max(200),
  category: z.enum(CATEGORY_SLUGS as [string, ...string[]]),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("published"),
  featured: z.boolean().default(false),
  sponsored: z.boolean().default(false),
  series: z
    .object({ name: z.string(), order: z.number().int().positive() })
    .optional(),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

/** Frontmatter contract for author profiles. */
export const authorFrontmatterSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().optional(),
  bio: z.string().min(1),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export type AuthorFrontmatter = z.infer<typeof authorFrontmatterSchema>;

/** Newsletter signup payload (shared by client + API route). */
export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  source: z.string().optional(),
});

/** Comment payload. */
export const commentSchema = z.object({
  postSlug: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
  authorName: z.string().min(1).max(80),
  body: z.string().min(1).max(2000),
});
