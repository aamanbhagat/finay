import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional + conflicting Tailwind classes safely. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian Rupees (no decimals by default). */
export function formatINR(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

/** Compact Indian number formatting (e.g. 1,20,000). */
export function formatIndianNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(Number.isFinite(value) ? value : 0);
}

/** Short Indian currency (e.g. ₹5L, ₹2.5Cr, ₹50k) — good for axis ticks & bounds. */
export function formatINRCompact(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(v % 1e7 === 0 ? 0 : 1)}Cr`;
  if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(v % 1e5 === 0 ? 0 : 1)}L`;
  if (Math.abs(v) >= 1e3) return `₹${(v / 1e3).toFixed(0)}k`;
  return `₹${v}`;
}

/** Human-readable date (e.g. "17 Jun 2026"). */
export function formatDate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** ISO date string (for <time dateTime> and schema). */
export function toISODate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toISOString();
}

/** Build an absolute URL from a path using the configured site URL. */
export function absoluteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolutise an image src — leaves remote (http) URLs untouched. */
export function absoluteImage(src: string): string {
  return /^https?:\/\//.test(src) ? src : absoluteUrl(src);
}

/** Turn arbitrary text into a URL slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
