/**
 * Research step — the bot "studies the situation" and picks ONE topic.
 * The model receives the full competitive context (what's already published,
 * what keywords are taken, which tools exist to link to) plus the strategy rails,
 * and returns a structured SEO content brief.
 */
import { chatJson } from "./gateway";
import { describeKeywordTier } from "./strategy";
import { AUDIENCE, YEAR_RULE } from "./config";
import { CATEGORIES, TOOLS, type CategorySlug } from "../lib/constants";
import { slugify } from "../lib/utils";
import type { ContentBrief, Memory, RunStrategy, SiteState } from "./types";

const SYSTEM = `You are the head of SEO strategy and content for "Compound", a finance
publication for ${AUDIENCE}. You are ruthless about search intent, topical authority,
and internal linking. You never chase keywords the site cannot yet rank for. You write
in clear, trustworthy, non-hyped financial English. You always respond with valid JSON only.`;

export async function research(
  state: SiteState,
  strategy: RunStrategy,
  mem: Memory,
): Promise<ContentBrief> {
  const toolList = TOOLS.map((t) => `- /tools/${t.slug} — ${t.name}: ${t.description}`).join("\n");
  const categoryList = CATEGORIES.map((c) => `- ${c.slug}: ${c.name} — ${c.description}`).join("\n");
  const internalCandidates = state.slugs.slice(0, 40).map((s) => `/blog/${s}`).join(", ") || "(none yet)";
  const memNotes = strategy.memoryNotes.length
    ? strategy.memoryNotes.map((n) => `- ${n}`).join("\n")
    : "(no prior lessons yet)";

  const prompt = `${YEAR_RULE}

# SITE SITUATION
- Site age: ${state.ageDays} days old
- Total published articles: ${state.totalPosts}
- Lifecycle phase: ${strategy.phaseLabel}
- Coverage by category (counts): ${JSON.stringify(state.categoryCounts)}
- Under-served categories (prioritise): ${state.weakestCategories.slice(0, 3).join(", ")}
- Emerging clusters (tag×count): ${state.emergingClusters.slice(0, 6).map((c) => `${c.tag}(${c.count})`).join(", ") || "none"}

# THIS RUN'S MANDATE (phase policy — obey it)
${strategy.mandate}

# KEYWORD TARGET FOR THIS ARTICLE
Target a ${describeKeywordTier(strategy.keywordTier)} keyword.
Preferred category: "${strategy.targetCategory}".
${strategy.reinforceCluster ? `Reinforce the existing cluster around the tag "${strategy.reinforceCluster}" (interlink with its siblings).` : ""}

# ALREADY PUBLISHED — DO NOT DUPLICATE THESE TITLES
${state.titles.map((t) => `- ${t}`).join("\n") || "(none yet)"}

# KEYWORDS ALREADY TARGETED — PICK SOMETHING DISTINCT
${mem.usedKeywords.slice(-60).join(" | ") || "(none yet)"}

# LESSONS FROM PAST RUNS (apply them)
${memNotes}

# CATEGORIES (use one slug exactly)
${categoryList}

# CALCULATORS TO LINK TO (use these exact paths where relevant)
${toolList}

# EXISTING ARTICLES TO INTERLINK (use exact paths)
${internalCandidates}

# TASK
Pick the single best NEW article to publish right now to grow organic search
traffic, given the situation and mandate above. Choose a specific primary keyword
in the required tier that this young site can realistically rank for. Then produce
a complete SEO brief.

Return ONLY this JSON object:
{
  "title": "compelling, specific, <=70 chars, includes primary keyword naturally",
  "primaryKeyword": "the exact target search query",
  "secondaryKeywords": ["3-6 related/LSI keywords"],
  "searchIntent": "one sentence: what the searcher actually wants",
  "category": "one of the category slugs",
  "tags": ["3-5 Title Case tags; reuse existing cluster tags when reinforcing"],
  "description": "meta description, 110-160 chars, includes primary keyword, compelling",
  "angle": "1-2 sentences: the unique, more-useful take that beats current SERP results",
  "outline": ["6-9 H2 section titles forming a logical, intent-satisfying structure"],
  "internalLinks": [{"href": "/tools/... or /blog/... or /category/...", "anchor": "descriptive anchor text"}],
  "faq": [{"q": "common question", "a": "concise 1-2 sentence answer"}],
  "figure": {"title": "short clean chart title, <=50 chars, NO colon/parenthetical data", "unit": "one of: ₹  %  x  (just the symbol)", "points": [{"label": "short label <=18 chars", "value": 123}]}
}
Include 3-6 internalLinks (at least one calculator if relevant) and 3-5 faq items.
The "figure" is a small, REAL, article-relevant dataset (2-4 points) for an inline bar chart
(e.g. tax under old vs new regime, returns at different rates, cost comparison). Use accurate
${"" /* keep numbers realistic */}numbers consistent with the article body. If no meaningful numeric comparison fits, set figure to null.`;

  const brief = await chatJson<ContentBrief>(prompt, {
    system: SYSTEM,
    temperature: 0.8,
    maxTokens: 2000,
  });

  // Normalise + harden the model output.
  brief.slug = slugify(brief.title).slice(0, 80);
  brief.category = normaliseCategory(brief.category, strategy.targetCategory);
  brief.tags = (brief.tags ?? []).slice(0, 5).map((t) => t.trim()).filter(Boolean);
  brief.secondaryKeywords = (brief.secondaryKeywords ?? []).slice(0, 8);
  brief.internalLinks = (brief.internalLinks ?? []).filter((l) => l?.href && l?.anchor).slice(0, 8);
  brief.faq = (brief.faq ?? []).filter((f) => f?.q && f?.a).slice(0, 6);

  // Normalise the figure dataset; drop it unless it has ≥2 numeric points.
  const fig = brief.figure;
  const points = (fig?.points ?? [])
    .map((p) => ({ label: String(p?.label ?? "").slice(0, 24), value: Number(p?.value) }))
    .filter((p) => p.label && Number.isFinite(p.value));
  brief.figure =
    fig && points.length >= 2
      ? { title: String(fig.title ?? brief.title).slice(0, 80), unit: String(fig.unit ?? "").slice(0, 3), points: points.slice(0, 4) }
      : undefined;

  return brief;
}

function normaliseCategory(value: string, fallback: CategorySlug): CategorySlug {
  const slug = slugify(value) as CategorySlug;
  return CATEGORIES.some((c) => c.slug === slug) ? slug : fallback;
}
