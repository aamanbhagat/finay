/** Single source of truth for site-wide config, taxonomy, and navigation. */

export const SITE = {
  name: "Compound",
  tagline: "Money, markets, and the math between.",
  description:
    "Finance, clearly explained — stocks, crypto, tax, banking, and insurance for Indian investors. Plus instant calculators that share their results in one click.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_IN",
  twitter: "@compound",
  defaultOgImage: "/og-default.png",
} as const;

export const SOCIAL_LINKS = [
  { label: "X / Twitter", href: "https://twitter.com/compound", icon: "Twitter" },
  { label: "LinkedIn", href: "https://linkedin.com/company/compound", icon: "Linkedin" },
  { label: "RSS", href: "/feed.xml", icon: "Rss" },
] as const;

export type CategorySlug =
  | "stocks"
  | "crypto"
  | "personal-finance"
  | "banking"
  | "tax"
  | "insurance";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  /** lucide-react icon name */
  icon: string;
  /** accent hue for the category card (CSS color) */
  accent: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "stocks",
    name: "Stocks",
    description: "Markets, equities, and company analysis for the long game.",
    icon: "TrendingUp",
    accent: "#34d399",
  },
  {
    slug: "crypto",
    name: "Crypto",
    description: "Digital assets, on-chain trends, and the risk that rides along.",
    icon: "Bitcoin",
    accent: "#fb923c",
  },
  {
    slug: "personal-finance",
    name: "Personal Finance",
    description: "Budgeting, saving, and building wealth one decision at a time.",
    icon: "Wallet",
    accent: "#60a5fa",
  },
  {
    slug: "banking",
    name: "Banking",
    description: "Accounts, deposits, loans, and getting more from your bank.",
    icon: "Landmark",
    accent: "#a78bfa",
  },
  {
    slug: "tax",
    name: "Tax",
    description: "Regimes, deductions, and filing — minus the jargon.",
    icon: "ReceiptText",
    accent: "#f472b6",
  },
  {
    slug: "insurance",
    name: "Insurance",
    description: "Cover that fits — health, term, and everything between.",
    icon: "ShieldCheck",
    accent: "#22d3ee",
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_NAV = {
  Sections: CATEGORIES.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
  Tools: [
    { label: "SIP Calculator", href: "/tools/sip" },
    { label: "EMI Calculator", href: "/tools/emi" },
    { label: "Income Tax", href: "/tools/income-tax" },
    { label: "All Tools", href: "/tools" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Advertise", href: "/advertise" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
} as const;

export interface Tool {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: string;
}

export const TOOLS: Tool[] = [
  {
    slug: "sip",
    name: "SIP Calculator",
    short: "Grow monthly investments",
    description: "Project the future value of a monthly SIP at an expected rate of return.",
    icon: "PiggyBank",
  },
  {
    slug: "emi",
    name: "EMI Calculator",
    short: "Loan monthly payment",
    description: "Work out the EMI, total interest, and payoff for any loan.",
    icon: "Landmark",
  },
  {
    slug: "fd-rd",
    name: "FD / RD Calculator",
    short: "Fixed & recurring deposits",
    description: "Maturity value of a fixed or recurring deposit with compounding.",
    icon: "Banknote",
  },
  {
    slug: "compound-interest",
    name: "Compound Interest",
    short: "Power of compounding",
    description: "See how a lumpsum compounds over time at any frequency.",
    icon: "LineChart",
  },
  {
    slug: "income-tax",
    name: "Income Tax Estimator",
    short: "Old vs new regime",
    description: "Compare your tax under India's old and new regimes side by side.",
    icon: "ReceiptText",
  },
  {
    slug: "retirement",
    name: "Retirement Corpus",
    short: "Plan your nest egg",
    description: "Estimate the corpus you need and whether you're on track.",
    icon: "Hourglass",
  },
  {
    slug: "cagr",
    name: "Stock Returns (CAGR)",
    short: "Annualised growth",
    description: "Compute the compound annual growth rate of any investment.",
    icon: "TrendingUp",
  },
  {
    slug: "lumpsum-vs-sip",
    name: "Lumpsum vs SIP",
    short: "Compare strategies",
    description: "Compare investing a lumpsum against staggering it as a SIP.",
    icon: "GitCompareArrows",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/** Pagination + reading defaults. */
export const POSTS_PER_PAGE = 9;
export const WORDS_PER_MINUTE = 200;
export const REVALIDATE_SECONDS = 3600;

/** Lightweight LQIP used as next/image blur placeholder (navy tint). */
export const BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Crect width='100%25' height='100%25' fill='%2315253d'/%3E%3C/svg%3E";
