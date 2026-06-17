/**
 * Orchestrator + CLI for the autonomous SEO writer.
 *
 *   pnpm bot                 → research, write & publish 1 article
 *   pnpm bot --count=3       → publish 3 articles in one run
 *   pnpm bot:plan            → dry run: show phase, strategy & brief, write nothing
 *   pnpm bot --birth=2026-06-16   → lock/override the site's birthday (age logic)
 *
 * Pipeline per article:  study site → resolve strategy → research topic →
 * write full MDX → validate & publish → reflect (self-learning) → save memory.
 */
import "./env"; // MUST be first — loads .env.local before config reads process.env
import { GATEWAY } from "./config";
import { readSiteState, titleSimilarity } from "./site-state";
import { loadMemory, saveMemory, recordRun, setPhase } from "./memory";
import { buildStrategy, describeKeywordTier } from "./strategy";
import { research } from "./research";
import { writeArticle } from "./writer";
import { publishArticle } from "./publish";
import { chat } from "./gateway";
import { TITLE_SIMILARITY_BLOCK, SITE_BIRTH } from "./config";
import { ensureKey } from "./indexnow";
import { SITE } from "../lib/constants";
import type { ContentBrief, Memory, RunStrategy } from "./types";

interface Args {
  count: number;
  plan: boolean;
  birth?: string;
  verbose: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { count: 1, plan: false, verbose: false };
  for (const a of argv) {
    if (a === "--plan" || a === "--dry") args.plan = true;
    else if (a === "--verbose" || a === "-v") args.verbose = true;
    else if (a.startsWith("--count=")) args.count = Math.max(1, Number(a.split("=")[1]) || 1);
    else if (a.startsWith("--birth=")) args.birth = a.split("=")[1];
  }
  return args;
}

/** Short self-reflection the bot stores to guide future runs. */
async function reflect(brief: ContentBrief, strategy: RunStrategy): Promise<string[]> {
  try {
    const note = await chat(
      `You just published "${brief.title}" (keyword: "${brief.primaryKeyword}", ` +
        `tier: ${strategy.keywordTier}, category: ${brief.category}, phase: ${strategy.phase}). ` +
        `In ONE sentence, give your future self a concrete, non-generic strategic note: a gap to ` +
        `cover next, a cluster to extend, or an internal-linking opportunity. No preamble.`,
      { temperature: 0.6, maxTokens: 120 },
    );
    return [note.replace(/^[-*]\s*/, "").trim()].filter(Boolean);
  } catch {
    return [];
  }
}

function banner(strategy: RunStrategy, mem: Memory): void {
  console.log("\n┌─ Compound · Autonomous SEO Writer ─────────────────────");
  console.log(`│ Model        : ${GATEWAY.model}`);
  console.log(`│ Site age     : ${strategy.ageDays} days  ·  ${strategy.totalPosts} posts`);
  console.log(`│ Phase        : ${strategy.phaseLabel}`);
  console.log(`│ Keyword tier : ${describeKeywordTier(strategy.keywordTier)}`);
  console.log(`│ Target cat.  : ${strategy.targetCategory}`);
  console.log(`│ Word target  : ${strategy.wordCount[0]}–${strategy.wordCount[1]}`);
  if (strategy.reinforceCluster) console.log(`│ Reinforcing  : #${strategy.reinforceCluster}`);
  console.log(`│ Lessons known: ${mem.notes.length}`);
  console.log("└────────────────────────────────────────────────────────");
}

async function generateOne(mem: Memory, plan: boolean): Promise<Memory> {
  const state = readSiteState(mem.siteBirth);
  const strategy = buildStrategy(state, mem);
  banner(strategy, mem);

  console.log("\n→ Researching topic…");
  let brief = await research(state, strategy, mem);

  // Dedupe guard: if the chosen title is too close to an existing one, retry once.
  const maxSim = Math.max(0, ...state.titles.map((t) => titleSimilarity(t, brief.title)));
  if (maxSim >= TITLE_SIMILARITY_BLOCK) {
    console.log(`  ↻ "${brief.title}" too similar to existing (${maxSim.toFixed(2)}); re-researching…`);
    brief = await research(state, strategy, mem);
  }

  console.log(`  · Title   : ${brief.title}`);
  console.log(`  · Keyword : ${brief.primaryKeyword}  [${strategy.keywordTier}]`);
  console.log(`  · Category: ${brief.category}   Tags: ${brief.tags.join(", ")}`);
  console.log(`  · Intent  : ${brief.searchIntent}`);
  console.log(`  · Angle   : ${brief.angle}`);
  console.log(`  · Outline : ${brief.outline.length} sections, ${brief.faq.length} FAQs, ${brief.internalLinks.length} internal links`);

  if (plan) {
    console.log("\n(plan mode — nothing written)\n");
    return mem;
  }

  console.log("\n→ Writing full article…");
  const body = await writeArticle(brief, strategy);

  console.log("→ Generating images, validating & publishing…");
  const result = await publishArticle(brief, body);
  console.log(`  ✓ ${result.filePath}  (${result.wordCount} words, by ${result.author})`);

  console.log("→ Reflecting (self-learning)…");
  const notes = await reflect(brief, strategy);
  if (notes.length) console.log(`  ✎ ${notes[0]}`);

  recordRun(
    mem,
    {
      ts: new Date().toISOString(),
      phase: strategy.phase,
      category: brief.category,
      keywordTier: strategy.keywordTier,
      primaryKeyword: brief.primaryKeyword,
      title: brief.title,
      slug: result.slug,
      wordCount: result.wordCount,
    },
    brief.tags,
    notes,
  );

  // Queue this URL for IndexNow. The CI workflow pings AFTER the deploy lands.
  ensureKey(mem);
  const newUrl = `${SITE.url.replace(/\/$/, "")}/blog/${result.slug}`;
  mem.pendingPings = [...new Set([...(mem.pendingPings ?? []), newUrl])];

  return mem;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const mem = loadMemory();

  // Lock the site's birthday. Priority: --birth flag > existing memory > config.
  if (args.birth) mem.siteBirth = args.birth;
  if (!mem.siteBirth) {
    mem.siteBirth = SITE_BIRTH;
    console.log(`ℹ Locked site birthday: ${mem.siteBirth}`);
  }

  let current = mem;
  for (let i = 0; i < args.count; i++) {
    if (args.count > 1) console.log(`\n══════ Article ${i + 1} / ${args.count} ══════`);
    current = await generateOne(current, args.plan);
    setPhase(current, buildStrategy(readSiteState(current.siteBirth), current).phase);
    if (!args.plan) saveMemory(current); // persist after each article
  }

  if (!args.plan) {
    saveMemory(current);
    console.log(`\n✅ Done. ${current.runs.length} total articles tracked in memory.\n`);
  }
}

main().catch((err) => {
  console.error("\n✗ Bot failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
