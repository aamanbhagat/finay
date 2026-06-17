/** Mock "live-ish" market quotes for the ticker. Swap for a real API later. */
export interface Quote {
  symbol: string;
  price: number;
  changePct: number;
}

const BASE_QUOTES: Quote[] = [
  { symbol: "NIFTY 50", price: 24512.3, changePct: 0.62 },
  { symbol: "SENSEX", price: 80734.1, changePct: 0.48 },
  { symbol: "BANK NIFTY", price: 52218.9, changePct: -0.31 },
  { symbol: "USD/INR", price: 83.42, changePct: -0.12 },
  { symbol: "GOLD (10g)", price: 73450, changePct: 0.85 },
  { symbol: "BTC/USD", price: 67890, changePct: 1.94 },
  { symbol: "ETH/USD", price: 3542, changePct: -0.76 },
  { symbol: "CRUDE", price: 6420, changePct: 0.22 },
];

/** Stable, deterministic quotes — used for SSR + first client render (no mismatch). */
export function getInitialQuotes(): Quote[] {
  return BASE_QUOTES.map((q) => ({ ...q }));
}

/** Return quotes with a small jitter so the bar feels alive. Client-only. */
export function getMarketQuotes(): Quote[] {
  const drift = () => (Math.random() - 0.5) * 0.4;
  return BASE_QUOTES.map((q) => ({
    ...q,
    changePct: Number((q.changePct + drift()).toFixed(2)),
  }));
}
