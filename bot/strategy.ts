/**
 * The deterministic strategy brain. Given the site snapshot + memory, it decides
 * the phase, the keyword tier for THIS article, which category to reinforce, and
 * which cluster (if any) to extend. The LLM never decides these — it only fills
 * in the creative brief within these rails. That separation keeps the long-term
 * SEO policy predictable and auditable.
 */
import { PHASES, type KeywordTier, type PhaseDef } from "./config";
import type { CategorySlug } from "../lib/constants";
import type { Memory, RunStrategy, SiteState } from "./types";

/** Most advanced phase reached by EITHER age or inventory. */
export function resolvePhase(ageDays: number, totalPosts: number): PhaseDef {
  let ageIdx = 0;
  let countIdx = 0;
  PHASES.forEach((p, i) => {
    if (ageDays >= p.minAgeDays) ageIdx = i;
    if (totalPosts >= p.minPosts) countIdx = i;
  });
  return PHASES[Math.max(ageIdx, countIdx)];
}

/** Weighted random pick from the phase's keyword-tier mix. */
function pickKeywordTier(mix: Record<KeywordTier, number>): KeywordTier {
  const entries = Object.entries(mix).filter(([, w]) => w > 0) as [KeywordTier, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [tier, w] of entries) {
    r -= w;
    if (r <= 0) return tier;
  }
  return entries[0][0];
}

/**
 * Choose the category. Mostly reinforce the weakest (to balance coverage), but
 * leave room to deepen a category that already has momentum — real sites aren't
 * perfectly uniform. 70% balance, 30% follow an emerging cluster.
 */
function pickCategory(state: SiteState, reinforceCategory?: CategorySlug): CategorySlug {
  if (reinforceCategory && Math.random() < 0.3) return reinforceCategory;
  // Weight inversely to current count among the 3 weakest.
  const pool = state.weakestCategories.slice(0, 3);
  return pool[Math.floor(Math.random() * pool.length)] ?? state.weakestCategories[0];
}

export function buildStrategy(state: SiteState, mem: Memory): RunStrategy {
  const phase = resolvePhase(state.ageDays, state.totalPosts);
  const keywordTier = pickKeywordTier(phase.keywordMix);

  // Decide whether to extend a cluster that has momentum (sprout+ only).
  const reinforce =
    phase.id !== "seed" && state.emergingClusters.length > 0
      ? state.emergingClusters[Math.floor(Math.random() * Math.min(3, state.emergingClusters.length))]
      : undefined;

  // If reinforcing, nudge the category toward where that cluster lives — but we
  // don't know it precisely here, so just bias category selection generally.
  const targetCategory = pickCategory(state);

  return {
    phase: phase.id,
    phaseLabel: phase.label,
    ageDays: state.ageDays,
    totalPosts: state.totalPosts,
    keywordTier,
    wordCount: phase.wordCount,
    targetCategory,
    mandate: phase.mandate,
    memoryNotes: mem.notes.slice(-8),
    reinforceCluster: reinforce?.tag,
  };
}

/** Short human-readable explainer for logs / dry-run reports. */
export function describeKeywordTier(tier: KeywordTier): string {
  switch (tier) {
    case "long-tail":
      return "long-tail (4+ words, specific, low competition, high intent)";
    case "mid-tail":
      return "mid-tail (2–3 words, moderate volume & competition)";
    case "short-tail":
      return "short-tail (1–2 words, high volume, competitive)";
    case "head":
      return "head term (broad, very high volume, very competitive)";
  }
}
