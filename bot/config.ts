/**
 * Autonomous SEO writer — configuration & the phase "brain".
 *
 * This file is the bot's strategic backbone. Everything that decides WHAT and
 * HOW MUCH to write as the site matures lives here, so the policy is auditable
 * in one place and easy to tune over the years without touching logic.
 *
 * Core idea: a brand-new site can't rank for "best mutual funds" on day one.
 * It can rank for "how much SIP to invest for 1 crore in 15 years". So the bot
 * starts on ultra-specific long-tail keywords (low competition, fast to index,
 * high intent) and, as the domain accumulates articles + age + topical
 * authority, it shifts the keyword mix toward mid-tail then head terms.
 */

import path from "node:path";
import type { CategorySlug } from "../lib/constants";

// ── Paths ────────────────────────────────────────────────────────────────
export const ROOT = process.cwd();
export const BLOG_DIR = path.join(ROOT, "content", "blog");
export const AUTHORS_DIR = path.join(ROOT, "content", "authors");
export const MEMORY_FILE = path.join(ROOT, "bot", "memory.json");
/** Generated images live in public/ so Next serves + optimizes them. */
export const PUBLIC_IMG_DIR = path.join(ROOT, "public", "blog");
export const PUBLIC_IMG_URL = "/blog"; // URL prefix for the above

// ── Time anchors ─────────────────────────────────────────────────────────────
/** The site's official launch date — drives age-based phase logic. */
export const SITE_BIRTH = "2026-06-17";
/** Current calendar year — articles must use this, never 2025. */
export const CURRENT_YEAR = 2026;
export const CURRENT_DATE_LABEL = "17 June 2026";

// ── AI Gateway ─────────────────────────────────────────────────────────────
export const GATEWAY = {
  /** Vercel AI Gateway, OpenAI-compatible endpoint. */
  baseUrl: process.env.AI_GATEWAY_BASE_URL ?? "https://ai-gateway.vercel.sh/v1",
  model: process.env.AI_GATEWAY_MODEL ?? "anthropic/claude-haiku-4.5",
  apiKey: process.env.AI_GATEWAY_API_KEY ?? "",
  /** Fail a request after this long, then retry. */
  timeoutMs: 90_000,
  maxRetries: 3,
} as const;

// ── Keyword tiers ───────────────────────────────────────────────────────────
export type KeywordTier = "long-tail" | "mid-tail" | "short-tail" | "head";

// ── Phase model ──────────────────────────────────────────────────────────────
export type Phase = "seed" | "sprout" | "growth" | "authority" | "dominance";

export interface PhaseDef {
  id: Phase;
  label: string;
  /** Reach this phase once age OR post-count passes either threshold. */
  minAgeDays: number;
  minPosts: number;
  /** Probability weights for the keyword tier of each new article. */
  keywordMix: Record<KeywordTier, number>;
  /** Target word-count band for the body. */
  wordCount: [min: number, max: number];
  /** Suggested publishing cadence (used by the scheduler throttle). */
  perWeek: number;
  /** Plain-English mandate — also fed verbatim to the model as guidance. */
  mandate: string;
}

/**
 * Ordered seed → dominance. The bot picks the MORE ADVANCED of the
 * age-derived phase and the count-derived phase, so a 2-day-old site with 200
 * imported posts behaves like "authority", while a 2-year-old site with 4
 * posts still behaves like "seed". Age and inventory both matter.
 */
export const PHASES: PhaseDef[] = [
  {
    id: "seed",
    label: "Seed (0–2 weeks / <12 posts)",
    minAgeDays: 0,
    minPosts: 0,
    keywordMix: { "long-tail": 0.85, "mid-tail": 0.15, "short-tail": 0, head: 0 },
    wordCount: [1500, 2200],
    perWeek: 5,
    mandate:
      "Brand-new domain with zero authority. Win the keywords nobody fights for: " +
      "ultra-specific, long-tail, question- and number-driven queries (e.g. " +
      "'how much SIP for 1 crore in 15 years', 'is FD interest taxable for senior citizens'). " +
      "Each post must fully resolve ONE precise intent, link to a relevant calculator, " +
      "and get indexed fast. Breadth of micro-topics > depth of competition.",
  },
  {
    id: "sprout",
    label: "Sprout (2–8 weeks / 12–30 posts)",
    minAgeDays: 15,
    minPosts: 12,
    keywordMix: { "long-tail": 0.65, "mid-tail": 0.3, "short-tail": 0.05, head: 0 },
    wordCount: [1700, 2400],
    perWeek: 4,
    mandate:
      "Early traction. Keep mining long-tail but begin CLUSTERING: group related " +
      "long-tail posts around an emerging topic so they interlink and reinforce each " +
      "other. Introduce comparison/commercial-intent posts ('X vs Y'). Strengthen " +
      "internal links between siblings in the same cluster.",
  },
  {
    id: "growth",
    label: "Growth (2–5 months / 30–60 posts)",
    minAgeDays: 61,
    minPosts: 30,
    keywordMix: { "long-tail": 0.45, "mid-tail": 0.35, "short-tail": 0.15, head: 0.05 },
    wordCount: [2000, 2800],
    perWeek: 3,
    mandate:
      "Topical authority forming. Publish PILLAR pages (broad, definitive guides) and " +
      "wire every related long-tail post into them. Start targeting mid-tail terms with " +
      "real volume. Refresh the oldest posts with updated figures and new internal links.",
  },
  {
    id: "authority",
    label: "Authority (5–12 months / 60–120 posts)",
    minAgeDays: 151,
    minPosts: 60,
    keywordMix: { "long-tail": 0.3, "mid-tail": 0.35, "short-tail": 0.25, head: 0.1 },
    wordCount: [2200, 3200],
    perWeek: 3,
    mandate:
      "Established authority. Now compete for short-tail and selected head terms the " +
      "clusters have earned the right to rank for. Prioritise commercial-intent and " +
      "high-volume queries. Aggressively interlink; run a content-refresh cycle on " +
      "anything older than ~6 months.",
  },
  {
    id: "dominance",
    label: "Dominance (1 year+ / 120+ posts)",
    minAgeDays: 366,
    minPosts: 120,
    keywordMix: { "long-tail": 0.2, "mid-tail": 0.3, "short-tail": 0.3, head: 0.2 },
    wordCount: [2400, 3500],
    perWeek: 2,
    mandate:
      "Category leader. Defend head terms, capture new micro-trends fast (trend-jacking), " +
      "consolidate thin posts into definitive guides, and prioritise refreshing/updating " +
      "winners over net-new volume. Quality and freshness over raw output.",
  },
];

// ── Author routing (topical authority: writer matches subject) ───────────────
export const AUTHOR_BY_CATEGORY: Record<CategorySlug, string> = {
  stocks: "aarav-mehta",
  banking: "aarav-mehta",
  "personal-finance": "priya-nair",
  insurance: "priya-nair",
  crypto: "rohan-das",
  tax: "rohan-das",
};

// ── Cover images (curated, known-good Unsplash IDs from the seed set) ─────────
export const USE_COVERS = true;
const UNSPLASH = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
export const COVERS_BY_CATEGORY: Record<CategorySlug, string[]> = {
  stocks: [UNSPLASH("photo-1590283603385-17ffb3a7f29f"), UNSPLASH("photo-1611974789855-9c2a0a7236a3")],
  crypto: [UNSPLASH("photo-1621761191319-c6fb62004040")],
  "personal-finance": [UNSPLASH("photo-1554224155-6726b3ff858f"), UNSPLASH("photo-1450101499163-c8848c66ca85")],
  banking: [UNSPLASH("photo-1601597111158-2fceff292cdc")],
  tax: [UNSPLASH("photo-1554224154-26032ffc0d07")],
  insurance: [UNSPLASH("photo-1579621970795-87facc2f976d")],
};

// ── Generation knobs ─────────────────────────────────────────────────────────
/** Region/audience the content is written for. Keeps tax/currency consistent. */
export const AUDIENCE =
  `Indian retail investors and savers (INR, FY 2025-26 tax rules, current year ${CURRENT_YEAR})`;
/** Hard rule injected into every prompt so dates never drift to 2025. */
export const YEAR_RULE =
  `Today is ${CURRENT_DATE_LABEL}. The current calendar year is ${CURRENT_YEAR}. ` +
  `Whenever you mention "this year", the current/latest year, or a standalone year, use ${CURRENT_YEAR} — never 2025. ` +
  `For the Indian fiscal year use "FY 2025-26" (current) or "FY 2026-27" where appropriate.`;
/** Hard floor: never publish near-duplicate of an existing title (cosine-ish). */
export const TITLE_SIMILARITY_BLOCK = 0.7;
