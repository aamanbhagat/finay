/**
 * Writer step — turns the brief into a full-depth, SEO-optimised MDX body.
 * We deliberately let the model write ONLY the markdown body; the frontmatter is
 * assembled by us (publish.ts) so it always satisfies the Zod schema.
 */
import { chat } from "./gateway";
import { AUDIENCE, YEAR_RULE } from "./config";
import { SITE } from "../lib/constants";
import type { ContentBrief, RunStrategy } from "./types";

const SYSTEM = `You are a senior finance writer for "${SITE.name}", writing for ${AUDIENCE}.
Your work is accurate, specific, and genuinely useful — E-E-A-T grade. You write the way a
sharp human expert does: concrete numbers, worked examples in ₹, plain language, zero fluff,
no hype, no "in conclusion". You output clean MDX body content only.`;

export async function writeArticle(brief: ContentBrief, strategy: RunStrategy): Promise<string> {
  const [minWords, maxWords] = strategy.wordCount;
  const links = brief.internalLinks
    .map((l) => `- [${l.anchor}](${l.href})`)
    .join("\n");
  const faq = brief.faq.map((f) => `- Q: ${f.q}\n  A: ${f.a}`).join("\n");

  const prompt = `${YEAR_RULE}

Write a complete, publish-ready MDX article body.

TITLE (already set — do NOT repeat it as a heading): ${brief.title}
PRIMARY KEYWORD: ${brief.primaryKeyword}
SECONDARY KEYWORDS: ${brief.secondaryKeywords.join(", ")}
SEARCH INTENT: ${brief.searchIntent}
UNIQUE ANGLE: ${brief.angle}

SECTION OUTLINE (use as H2 ## headings, adapt wording for SEO, keep order logical):
${brief.outline.map((h) => `## ${h}`).join("\n")}

INTERNAL LINKS — weave these in naturally as markdown links with the given anchors:
${links || "(none)"}

FAQ — render as the final section before the disclaimer:
${faq || "(none)"}

STRICT RULES:
1. Length: ${minWords}–${maxWords} words. Substantive depth, no padding.
2. Start with a 2–3 sentence hook paragraph (NO heading) that uses the primary keyword naturally and states what the reader will get.
3. Use ## for sections and ### for sub-points. NEVER use # (H1) — the title is rendered separately.
4. Put the primary keyword in the first paragraph, in at least one H2, and naturally throughout (no stuffing).
5. Use concrete ₹ figures and at least one worked example. Use a Markdown TABLE where comparing options/numbers.
6. Use these MDX components where they add value (exact syntax):
   <Callout type="tip" title="...">...</Callout>  (types: info, tip, warning, disclaimer)
   Place exactly one <NewsletterInline /> roughly two-thirds through the article (on its own line).
7. Add a "## Frequently asked questions" section using the FAQ above, each question as a ### heading.
8. End with: <Callout type="disclaimer">Educational content, not investment advice...</Callout>
9. All facts must be accurate for India / FY 2025-26. If a number is an assumption, label it clearly. Any current-year reference uses 2026, never 2025.
10. NEVER write a bare "<" followed by a digit or space inside prose (e.g. "<1 year", "< 5%") — MDX will try to parse it as a JSX tag and break the build. Write "under 1 year" / "less than 5%" instead. The same applies to ">" only when it could be misread as JSX.
11. Output ONLY the MDX body. No frontmatter, no code fence around the whole thing, no preamble.`;

  const body = await chat(prompt, { system: SYSTEM, temperature: 0.7, maxTokens: 6000 });
  return sanitizeBody(body, brief.title);
}

/** Strip stray frontmatter / H1 / wrapping fences the model might emit. */
function sanitizeBody(body: string, title: string): string {
  let out = body.trim();

  // Remove an accidental leading YAML frontmatter block.
  if (out.startsWith("---")) {
    const end = out.indexOf("\n---", 3);
    if (end !== -1) out = out.slice(end + 4).trim();
  }
  // Remove a whole-document code fence if present.
  if (/^```(?:mdx|markdown)?\s*\n/.test(out) && out.endsWith("```")) {
    out = out.replace(/^```(?:mdx|markdown)?\s*\n/, "").replace(/\n```$/, "").trim();
  }
  // Demote/strip a duplicated H1 of the title.
  out = out
    .split("\n")
    .filter((line, i) => !(i < 3 && /^#\s+/.test(line)))
    .join("\n")
    .trim();
  // Belt-and-braces: turn any remaining H1 into H2.
  out = out.replace(/^#\s+/gm, "## ");

  // MDX 2 parses `<` followed by anything that isn't a letter/$/_ as a JSX tag
  // and refuses to compile. Escape bare `<` before digits/whitespace/punctuation
  // (line-by-line so we don't touch fenced code blocks).
  out = escapeBareAngles(out);
  void title;
  return out;
}

function escapeBareAngles(src: string): string {
  const lines = src.split("\n");
  let inFence = false;
  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      // Replace any `<` that is NOT immediately followed by a JSX-legal start char.
      // (letter, slash, !, $, _, or our known component prefixes).
      return line.replace(/<(?![a-zA-Z/!$_])/g, "&lt;");
    })
    .join("\n");
}
