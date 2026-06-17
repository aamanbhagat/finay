import type { CategorySlug } from "../lib/constants";
import type { KeywordTier, Phase } from "./config";

/** Snapshot of the live site the bot studies before every run. */
export interface SiteState {
  totalPosts: number;
  siteBirth: string; // ISO date — earliest publishedAt, or memory override
  ageDays: number;
  slugs: string[];
  titles: string[];
  recentTitles: string[]; // newest 12, for "don't repeat" context
  categoryCounts: Record<CategorySlug, number>;
  tagCounts: Record<string, number>;
  /** Categories with the fewest posts — balance coverage here. */
  weakestCategories: CategorySlug[];
  /** Tags appearing 2–4× — clusters with momentum worth reinforcing. */
  emergingClusters: { tag: string; count: number }[];
}

/** The strategy resolved for THIS run. */
export interface RunStrategy {
  phase: Phase;
  phaseLabel: string;
  ageDays: number;
  totalPosts: number;
  keywordTier: KeywordTier;
  wordCount: [number, number];
  targetCategory: CategorySlug;
  mandate: string;
  /** Strategic notes the bot left for its future self (self-learning). */
  memoryNotes: string[];
  reinforceCluster?: string;
}

/** Output of the research step — the chosen topic + SEO brief. */
export interface ContentBrief {
  title: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  category: CategorySlug;
  tags: string[];
  description: string; // meta description, 50–200 chars
  angle: string; // the unique take / why this beats existing SERP results
  outline: string[]; // H2 sections
  internalLinks: { href: string; anchor: string }[];
  faq: { q: string; a: string }[];
  /** Small dataset for an auto-generated inline bar chart (data viz). */
  figure?: { title: string; unit: string; points: { label: string; value: number }[] };
}

/** A single recorded run in the self-learning memory. */
export interface RunRecord {
  ts: string;
  phase: Phase;
  category: CategorySlug;
  keywordTier: KeywordTier;
  primaryKeyword: string;
  title: string;
  slug: string;
  wordCount: number;
}

/** Persistent self-learning store (bot/memory.json). */
export interface Memory {
  version: number;
  /** Locked once set — the site's "birthday" for age-based phase logic. */
  siteBirth: string | null;
  lastRunAt: string | null;
  runs: RunRecord[];
  usedKeywords: string[];
  usedTitles: string[];
  usedSlugs: string[];
  /** tag → cluster of related slugs the bot is deliberately building. */
  clusters: Record<string, { members: string[]; primaryKeywords: string[] }>;
  phaseHistory: { ts: string; phase: Phase }[];
  /** Free-form lessons the model writes to guide future runs. */
  notes: string[];
  /** Stable IndexNow key — generated once, hosted at /<key>.txt. */
  indexNowKey?: string;
  /** URLs queued for indexing; pinged after the live site has redeployed. */
  pendingPings?: string[];
}
