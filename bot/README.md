# Compound — Autonomous SEO Writer 🤖

A self-learning content engine that runs the blog like an SEO-savvy editor would.
It studies the site, decides what to write based on the site's **age + inventory**,
researches a topic it can actually rank for, writes a full-depth SEO article, and
remembers what it did so the next run is smarter.

Powered by the **Vercel AI Gateway** (`anthropic/claude-haiku-4.5`).

## Quick start

```bash
# 1. key is already in .env.local (AI_GATEWAY_API_KEY)
# 2. see the brain's plan without spending much (no file written):
pnpm bot:plan
# 3. write & publish one real article:
pnpm bot
# 4. batch:
pnpm bot --count=3
```

New `.mdx` files land in `content/blog/` and are picked up by the site
automatically (file-based MDX → SSG/ISR). Run `pnpm dev` to see them.

## How it thinks (the strategy)

A new domain can't rank for "best mutual funds". So the bot moves through
**lifecycle phases** and shifts its keyword mix from long-tail → head as it earns
authority. Phase is the *more advanced* of what age implies and what inventory
implies — so 200 imported posts on a 2-day-old site act mature, and 4 posts on a
2-year-old site still act new.

| Phase | Trigger (age **or** posts) | Keyword mix (long / mid / short / head) | Focus |
|---|---|---|---|
| Seed | 0d / 0 | 85 / 15 / 0 / 0 | ultra-specific long-tail, index fast, link to tools |
| Sprout | 15d / 12 | 65 / 30 / 5 / 0 | cluster long-tail, start comparisons |
| Growth | 61d / 30 | 45 / 35 / 15 / 5 | pillar pages, mid-tail, refresh old posts |
| Authority | 151d / 60 | 30 / 35 / 25 / 10 | short-tail + select head terms, commercial intent |
| Dominance | 366d / 120 | 20 / 30 / 30 / 20 | defend head terms, trend-jack, consolidate, refresh |

Within each run the brain also:
- targets the **weakest categories** to balance coverage,
- **reinforces emerging clusters** (tags appearing 2–4×) for topical authority,
- forces **internal links** (≥1 calculator where relevant) + a `<NewsletterInline />`,
- blocks near-duplicate titles (token-overlap guard).

All policy lives in [`config.ts`](./config.ts) — tune phases/mix/word-counts there.

## How it learns (`bot/memory.json`)

Written after every run, read before every run:
- `siteBirth` — locked once, drives age-based phase logic (override: `pnpm bot --birth=2026-06-16`)
- `runs`, `usedKeywords`, `usedTitles`, `usedSlugs` — so it never repeats itself
- `clusters` — tag → sibling slugs it's deliberately building (for interlinking)
- `phaseHistory` — when it graduated between phases
- `notes` — one-line strategic lessons the model writes to its future self

Delete `memory.json` to reset the bot's memory (the site is re-studied from disk anyway).

## Pipeline

```
study site (site-state) → resolve strategy (strategy) → research topic (research)
   → write MDX (writer) → validate vs Zod schema + publish (publish) → reflect → save memory
```

Frontmatter is assembled by the bot and validated against the **same**
`postFrontmatterSchema` the site uses at build time — invalid content never lands.

## Full autonomy — the LIVE site updates daily

`.github/workflows/auto-blog.yml` does the whole loop on GitHub Actions:

1. Generate article(s) (cron 04:30 UTC ≈ 10:00 IST — tune the `cron` line)
2. Commit `content/blog/<slug>.mdx` + `public/blog/<slug>/{cover,figure}.webp` + `bot/memory.json`
3. Push to `main` → Vercel/Netlify/Cloudflare auto-deploys
4. Wait 240s for the deploy
5. `pnpm bot:ping` → submits the new URL(s) to **IndexNow** (Bing/Yandex/Seznam/Naver index in minutes)
6. Commit the drained ping queue

### One-time setup

| Where | Key | Value |
|---|---|---|
| Repo → Settings → Secrets → Actions | `AI_GATEWAY_API_KEY` | your Vercel AI Gateway key (required) |
| Repo → Settings → Secrets → Actions | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` (so IndexNow pings the right host) |
| Repo → Settings → Secrets → Actions | `AI_GATEWAY_MODEL` | optional override (default `anthropic/claude-haiku-4.5`) |
| Repo → Settings → Secrets → Actions | `DEPLOY_HOOK_URL` | optional — only if your host is NOT Git-integrated |
| Google Search Console | submit `/sitemap.xml` | one-time; Google then crawls on its own |

Vercel: connect the repo via Git integration → every push auto-deploys, no extra config.

### Manual trigger

Repo → Actions → "Autonomous SEO blog writer" → **Run workflow** → set `count`.

### IndexNow

The bot owns its key (`bot/memory.json:indexNowKey`) and writes the verification
file at `public/<key>.txt`. Both are committed so the live site always exposes the
key. Google ignores IndexNow but uses sitemap.xml — submit it once in Search
Console and never touch it again.

## Files

| File | Role |
|---|---|
| `config.ts` | gateway + phase model + author/cover routing (the policy) |
| `gateway.ts` | Vercel AI Gateway client (fetch, retries, JSON mode) |
| `site-state.ts` | reads `content/blog`, computes age/coverage/clusters |
| `strategy.ts` | resolves phase + keyword tier + target category |
| `research.ts` | LLM → SEO content brief (topic, keyword, outline, links, FAQ) |
| `writer.ts` | LLM → full MDX body |
| `publish.ts` | validate frontmatter + write `.mdx` |
| `memory.ts` | self-learning store |
| `run.ts` | orchestrator + CLI |
