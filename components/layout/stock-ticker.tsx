"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";
import { getInitialQuotes, getMarketQuotes, type Quote } from "@/lib/market-data";
import { formatIndianNumber } from "@/lib/utils";

function QuoteItem({ quote }: { quote: Quote }) {
  const up = quote.changePct >= 0;
  return (
    <span className="inline-flex items-center gap-2.5 px-6 text-[11px]">
      <span className="font-semibold uppercase tracking-[0.12em] text-foreground/90">{quote.symbol}</span>
      <span className="tnum text-muted">{formatIndianNumber(quote.price)}</span>
      <span
        className={`tnum inline-flex items-center gap-0.5 font-semibold ${
          up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        }`}
      >
        {up ? <ArrowUpRight className="size-3" aria-hidden /> : <ArrowDownRight className="size-3" aria-hidden />}
        {up ? "+" : ""}
        {quote.changePct}%
      </span>
    </span>
  );
}

export function StockTicker() {
  const [quotes, setQuotes] = useState<Quote[]>(getInitialQuotes);

  useEffect(() => {
    const kick = setTimeout(() => setQuotes(getMarketQuotes()), 600);
    const id = setInterval(() => setQuotes(getMarketQuotes()), 5000);
    return () => {
      clearTimeout(kick);
      clearInterval(id);
    };
  }, []);

  const track = [...quotes, ...quotes];

  return (
    <div
      className="relative isolate flex items-center border-b border-border bg-surface"
      role="marquee"
      aria-label="Market quotes"
    >
      <div className="flex shrink-0 items-center gap-2 border-r border-border px-4 py-2.5">
        <span className="relative grid size-2 place-items-center">
          <span className="absolute size-2 rounded-full bg-gold animate-pulse-dot" />
          <span className="size-1.5 rounded-full bg-gold" />
        </span>
        <Radio className="size-3.5 text-accent-ink" aria-hidden />
        <span className="eyebrow text-accent-ink">Live tape</span>
      </div>
      <div className="fade-x flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee whitespace-nowrap py-2.5">
          {track.map((q, i) => (
            <QuoteItem key={`${q.symbol}-${i}`} quote={q} />
          ))}
        </div>
      </div>
    </div>
  );
}
