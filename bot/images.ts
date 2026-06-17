/**
 * Image generation. The bot designs branded SVGs (cover + an optional inline
 * data-viz figure) and rasterises them with sharp to WebP. The site serves them
 * through next/image, which re-encodes to AVIF/WebP per browser — so the
 * delivered format is the best one Google loves, while the on-disk source stays
 * OG-share-safe.
 *
 * SVGs are built from polished, on-brand TEMPLATES (navy/gold "ledger" look)
 * rather than free-form AI output, so every image is consistent and never broken.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { PUBLIC_IMG_DIR, PUBLIC_IMG_URL } from "./config";
import { getCategory } from "../lib/constants";
import type { ContentBrief } from "./types";

// Brand palette (mirrors the site's navy/gold tokens).
const NAVY_0 = "#060f1f";
const NAVY_1 = "#0c1c33";
const GOLD = "#f1b54a";
const INK = "#f5f3ec";
const MUTED = "#9fb0c8";

const W = 1200;
const COVER_H = 630;
const FIG_H = 720;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Greedy word-wrap into at most `maxLines` lines of ~`maxChars`. */
function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length <= maxChars) {
      line = (line + " " + w).trim();
    } else {
      if (line) lines.push(line);
      line = w;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  const used = lines.join(" ").split(/\s+/).length;
  if (used < words.length && lines.length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:]?$/, "") + "…";
  }
  return lines;
}

/** Deterministic smooth, upward-trending sparkline from a string seed. */
function sparkline(seed: string, x0: number, x1: number, yTop: number, yBot: number, n = 8): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rng = () => ((h = (h * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const pts: [number, number][] = [];
  let v = 0.25;
  for (let i = 0; i < n; i++) {
    v = Math.min(1, Math.max(0, v + (rng() - 0.35) * 0.28)); // upward bias
    const x = x0 + ((x1 - x0) * i) / (n - 1);
    const y = yBot - (yBot - yTop) * v;
    pts.push([x, y]);
  }
  return pts.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(" ");
}

function ledgerGrid(w: number, h: number, step = 60): string {
  let g = "";
  for (let x = step; x < w; x += step) g += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
  for (let y = step; y < h; y += step) g += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  return `<g stroke="${GOLD}" stroke-width="1" opacity="0.05">${g}</g>`;
}

function buildCoverSvg(title: string, categoryName: string): string {
  const lines = wrapText(title, 24, 3);
  const fontSize = lines.length >= 3 ? 56 : 64;
  const lh = fontSize + 14;
  const blockH = lines.length * lh;
  const startY = (COVER_H - blockH) / 2 + fontSize - 6;
  const titleTspans = lines
    .map((l, i) => `<tspan x="80" y="${startY + i * lh}">${escapeXml(l)}</tspan>`)
    .join("");
  const spark = sparkline(title, 0, W, 470, 600);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${COVER_H}" viewBox="0 0 ${W} ${COVER_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY_0}"/><stop offset="1" stop-color="${NAVY_1}"/>
    </linearGradient>
    <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${COVER_H}" fill="url(#bg)"/>
  ${ledgerGrid(W, COVER_H)}
  <rect x="0" y="0" width="8" height="${COVER_H}" fill="${GOLD}"/>
  <polygon points="0,${COVER_H} ${spark} ${W},${COVER_H}" fill="url(#sparkfill)"/>
  <polyline points="${spark}" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linejoin="round"/>
  <g font-family="Georgia, 'Times New Roman', serif">
    <text x="80" y="90" font-size="20" letter-spacing="4" fill="${GOLD}" font-family="Arial, sans-serif" font-weight="700">${escapeXml(categoryName.toUpperCase())}</text>
    <text font-size="${fontSize}" fill="${INK}" font-weight="600">${titleTspans}</text>
  </g>
  <g font-family="Arial, sans-serif">
    <circle cx="86" cy="${COVER_H - 52}" r="5" fill="${GOLD}"/>
    <text x="102" y="${COVER_H - 46}" font-size="22" fill="${INK}" font-weight="700">Compound</text>
    <text x="${W - 80}" y="${COVER_H - 46}" font-size="16" fill="${MUTED}" text-anchor="end">Money, markets, and the math between.</text>
  </g>
</svg>`;
}

/** ₹ prefixes the number; %, x, etc. follow it. */
function formatVal(value: number, unit: string): string {
  const n = new Intl.NumberFormat("en-IN").format(Math.round(value));
  if (unit === "₹" || unit === "$") return `${unit}${n}`;
  if (!unit) return n;
  return `${n}${unit}`;
}

/** Drop parenthetical/colon data dumps so chart titles stay clean. */
function cleanTitle(t: string): string {
  return t.replace(/\s*[(:].*$/, "").trim().slice(0, 64) || t.slice(0, 64);
}

function buildFigureSvg(rawTitle: string, unit: string, points: { label: string; value: number }[]): string {
  const title = cleanTitle(rawTitle);
  const data = points.slice(0, 4);
  const max = Math.max(...data.map((p) => p.value), 1);
  const padX = 90;
  const padTop = 150;
  const baseline = FIG_H - 130;
  const chartW = W - padX * 2;
  const slot = chartW / data.length;
  const barW = Math.min(150, slot * 0.5);

  const bars = data
    .map((p, i) => {
      const cx = padX + slot * i + slot / 2;
      const hgt = ((baseline - padTop) * p.value) / max;
      const y = baseline - hgt;
      return `
      <rect x="${cx - barW / 2}" y="${y}" width="${barW}" height="${hgt}" rx="6" fill="${GOLD}"/>
      <text x="${cx}" y="${y - 16}" font-size="26" fill="${INK}" font-weight="700" text-anchor="middle">${escapeXml(formatVal(p.value, unit))}</text>
      <text x="${cx}" y="${baseline + 36}" font-size="20" fill="${MUTED}" text-anchor="middle">${escapeXml(p.label)}</text>`;
    })
    .join("");

  const titleLines = wrapText(title, 46, 2);
  const titleTspans = titleLines
    .map((l, i) => `<tspan x="${padX}" y="${70 + i * 38}">${escapeXml(l)}</tspan>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${FIG_H}" viewBox="0 0 ${W} ${FIG_H}">
  <defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${NAVY_0}"/><stop offset="1" stop-color="${NAVY_1}"/></linearGradient></defs>
  <rect width="${W}" height="${FIG_H}" rx="20" fill="url(#bg2)"/>
  ${ledgerGrid(W, FIG_H)}
  <text font-family="Georgia, serif" font-size="32" fill="${INK}" font-weight="600">${titleTspans}</text>
  <line x1="${padX}" y1="${baseline}" x2="${W - padX}" y2="${baseline}" stroke="${MUTED}" stroke-width="1" opacity="0.4"/>
  <g font-family="Arial, sans-serif">${bars}</g>
  <text x="${W - padX}" y="${FIG_H - 40}" font-size="15" fill="${MUTED}" text-anchor="end">Source: Compound estimates · ${escapeXml(unit === "₹" ? "₹ figures" : unit)}</text>
</svg>`;
}

async function rasterize(svg: string, outPath: string): Promise<void> {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg), { density: 144 })
    .resize(W) // crisp, fixed width
    .webp({ quality: 90, effort: 5 })
    .toFile(outPath);
}

export interface GeneratedImages {
  cover: string;
  coverAlt: string;
  /** MDX block for the inline figure, ready to inject (empty if none). */
  figureBlock: string;
}

/** Build + write all images for an article; returns URLs/markup. */
export async function generateImages(brief: ContentBrief, slug: string): Promise<GeneratedImages> {
  const categoryName = getCategory(brief.category)?.name ?? "Finance";

  // Cover (always).
  const coverFile = path.join(PUBLIC_IMG_DIR, slug, "cover.webp");
  await rasterize(buildCoverSvg(brief.title, categoryName), coverFile);
  const cover = `${PUBLIC_IMG_URL}/${slug}/cover.webp`;
  const coverAlt = `${brief.title} — ${categoryName} guide by Compound`;

  // Inline data-viz figure (only if the brief supplied usable data).
  let figureBlock = "";
  const fig = brief.figure;
  if (fig && Array.isArray(fig.points) && fig.points.filter((p) => Number.isFinite(p.value)).length >= 2) {
    const points = fig.points.filter((p) => Number.isFinite(p.value)).slice(0, 4);
    const figFile = path.join(PUBLIC_IMG_DIR, slug, "figure.webp");
    await rasterize(buildFigureSvg(fig.title || brief.title, fig.unit || "", points), figFile);
    const figUrl = `${PUBLIC_IMG_URL}/${slug}/figure.webp`;
    const figTitle = cleanTitle(fig.title || brief.title);
    const alt = `${figTitle}: ${points.map((p) => `${p.label} ${formatVal(p.value, fig.unit || "")}`).join(", ")}`;
    figureBlock = `\n<figure>\n  <img src="${figUrl}" alt="${alt.replace(/"/g, "'")}" width="${W}" height="${FIG_H}" />\n  <figcaption>${escapeXml(figTitle)}</figcaption>\n</figure>\n`;
  }

  return { cover, coverAlt, figureBlock };
}
