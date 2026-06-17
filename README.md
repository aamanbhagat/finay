# Compound — finance blog

Production-grade finance blog built on **Next.js 16 (App Router)** with the latest stable of every layer. SEO-maximal, 100/100-Lighthouse-targeted, and structured for ongoing editorial work.

> **Status — Phase A complete.** Fully working static site: design system, homepage, blog (list + article + category + tag + author), 8 finance calculators, search, full SEO layer (metadata, JSON-LD, OG images, sitemap, RSS+Atom+JSON feeds, robots, manifest), error/loading states. Phase B (Supabase-backed newsletter/comments/likes + Auth.js admin panel + Resend email + Umami analytics) is wired with graceful fallbacks — works without keys, switches on automatically when env vars are present.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 + React 19 (App Router, Turbopack) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 (`@theme` tokens) + CSS variables |
| Content | MDX via `next-mdx-remote/rsc` + `gray-matter` + Zod-validated frontmatter |
| Charts | Recharts (dynamically imported) |
| Search | Fuse.js (client-side, prebuilt index) |
| Theme | `next-themes` (system + manual toggle) |
| Icons | `lucide-react` + tiny inline brand SVGs |
| Analytics | `@vercel/analytics` (+ Umami env-gated) |
| Backend (Phase B) | Supabase, Auth.js v5, Resend |

## Getting started

```sh
pnpm install
cp .env.example .env.local       # Phase A needs zero keys
pnpm dev                         # http://localhost:3000
```

Common scripts:

```sh
pnpm build            # Production build (Turbopack)
pnpm start            # Run production build
pnpm lint             # ESLint
ANALYZE=true pnpm build   # @next/bundle-analyzer report
```

## Folder layout

```
app/
  (site)/                 # Public route group — shared layout (Navbar, Footer, Ticker)
    page.tsx              # Homepage (hero + featured + categories + latest)
    blog/                 # Listing + filters + pagination
    blog/[slug]/          # SSG article page (TOC, share, reactions, related)
    category/[slug]/      # Category archive
    tag/[slug]/           # Tag archive
    author/[slug]/        # Author bio + their articles
    search/               # Client-side Fuse.js search
    tools/                # 8-calculator hub + dynamic [tool] route
    newsletter, about, contact, advertise, privacy-policy
  api/
    newsletter/           # Phase A: validates + logs (mock). Phase B: Supabase + Resend.
    og/                   # Edge runtime — dynamic OG cards via next/og
    search-index/         # Lightweight JSON index for Fuse.js
  sitemap.ts, robots.ts, manifest.ts
  feed.xml/, atom.xml/, feed.json/   # RSS 2.0 + Atom + JSON Feed
  not-found, error, global-error
components/
  blog/, home/, layout/, mdx/, search/, seo/, tools/, ui/
content/
  blog/*.mdx              # 8 seed articles across all categories
  authors/*.mdx           # 3 author profiles
lib/
  finance.ts              # Pure, unit-testable calculator math (SIP/EMI/FD/...)
  content.ts              # MDX loading, TOC extraction, related-posts scoring
  schema.ts               # Typed JSON-LD builders (Article, Breadcrumb, FAQ, ...)
  feed.ts                 # Shared Feed instance for all three feed formats
  utils.ts, constants.ts, validators.ts, indexnow.ts, market-data.ts
public/                   # Static assets (favicon, etc.)
```

## Authoring content

Drop an `.mdx` file in `content/blog/`. Frontmatter is validated against `lib/validators.ts`:

```mdx
---
title: "How to read a balance sheet"
description: "A 50–200 char hook that doubles as the meta description."
category: stocks                  # one of CATEGORY_SLUGS
tags: [Investing, Beginners]
author: aarav-mehta               # matches content/authors/<slug>.mdx
publishedAt: "2026-05-28"
cover: https://images.unsplash.com/...   # optional, used for OG too
coverAlt: "Descriptive alt text for SEO + a11y"
featured: true                    # optional — pinned on the homepage
status: published                 # draft | published | scheduled
---
```

Authoring conveniences:

- `<Callout type="info|tip|warning|disclaimer" title="...">…</Callout>` for breakouts.
- `<NewsletterInline />` drops an inline newsletter CTA mid-article.
- `rehype-pretty-code` (Shiki / "one-dark-pro") renders code blocks.
- `rehype-slug` + `rehype-autolink-headings` give every heading a clickable anchor; the TOC is auto-extracted by `lib/content.ts`.

## Design system

Brand palette is pinned: **navy `#0A1628`**, **gold `#F4B942`**, slate ramp, white. Typography is **Lora** (display serif) + **Inter** (body sans), both via `next/font/google` self-hosted at build time. The signature element is the **"ledger tape"** — a recurring hairline grid behind the hero and CTA blocks, paired with an animated SVG market-pulse line in navy + gold. Finance data uses tabular figures via Inter `font-variant-numeric: tabular-nums`.

Dark and light themes are driven by CSS custom properties under `:root` and `.dark` in `app/globals.css`. Toggling is via `next-themes` (class strategy, system preference default).

## SEO (best-in-class)

- `generateMetadata()` on every page — title template, 150–160 char descriptions, canonical, OG, Twitter, robots.
- Typed structured-data builders in `lib/schema.ts`: Organization, WebSite + SearchAction, CollectionPage, Article + BreadcrumbList + Person, WebApplication + FAQPage.
- Dynamic OG images at `/api/og?title=...&author=...&category=...` (edge runtime, branded navy/gold card).
- `app/sitemap.ts` — every post, category, tag, author, tool, plus image entries.
- `app/robots.ts` and `app/manifest.ts`.
- RSS 2.0 / Atom 1.0 / JSON Feed at `/feed.xml`, `/atom.xml`, `/feed.json` (shared builder).
- IndexNow ping helper (`lib/indexnow.ts`) — drop your `<KEY>.txt` into `/public` and set `INDEXNOW_KEY`.

## Phase B — switching on backends

These env vars enable each backend. Each system has a graceful no-op fallback when unset, so the app runs without any of them.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SECRET=
NEXTAUTH_URL=https://yourdomain
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=         # bcrypt hash
RESEND_API_KEY=
NEWSLETTER_FROM_EMAIL=
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
INDEXNOW_KEY=
```

Phase B brings Supabase tables (subscribers, comments, likes/bookmarks, view counts) behind RLS, a credentials-based admin panel (`/admin`) with MDX Post Composer + SEO score checker, double-opt-in newsletter via Resend, and the optional Umami snippet.

## Deploying

Optimised for **Vercel**: the OG route uses the edge runtime, image optimization uses Sharp (already installed), Vercel Analytics is wired in `app/layout.tsx`. Any Node 20+ host works; just set `NEXT_PUBLIC_SITE_URL` to the deployed origin so canonical/OG/sitemap URLs resolve correctly.

## License

UNLICENSED — proprietary code for this project.
