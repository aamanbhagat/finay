import { ArrowRight, Calculator, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { MarketPulse } from "@/components/home/market-pulse";

const NOW = new Date();
const ISSUE = Math.max(1, Math.floor((NOW.getTime() - new Date(2025, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7)));
const ISSUE_DATE = NOW.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div className="aurora absolute inset-0 opacity-70" aria-hidden />
      <div className="ledger-grid absolute inset-0 opacity-50" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-px"
        aria-hidden
        style={{ background: "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--color-gold) 60%, transparent) 30%, color-mix(in oklab, var(--color-gold) 60%, transparent) 70%, transparent 100%)" }}
      />

      <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.95fr] lg:py-28">
        {/* Left — editorial column */}
        <div className="relative">
          <div className="mb-8 flex flex-wrap items-center gap-5">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
              Issue №{ISSUE.toString().padStart(3, "0")}
            </span>
            <span className="h-px w-12 bg-border-strong" />
            <span className="font-mono text-xs text-muted">{ISSUE_DATE}</span>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-tight text-foreground">
            Money,{" "}
            <span className="relative inline-block">
              <em className="text-accent-ink" style={{ fontStyle: "italic", fontVariationSettings: "'SOFT' 100" }}>
                markets,
              </em>
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                className="absolute -bottom-1 left-0 w-full text-accent-ink"
                preserveAspectRatio="none"
              >
                <path d="M2 8 Q 50 2, 100 6 T 198 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              </svg>
            </span>
            <br />
            and the math <span className="italic text-foreground" style={{ fontVariationSettings: "'SOFT' 100" }}>between</span>.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            Independent finance journalism for India — analysis on stocks, crypto, tax, and personal
            finance, paired with instant calculators that turn the math into a decision.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink
              href="/blog"
              size="lg"
              className="bg-gold text-navy font-semibold shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--color-gold)_50%,transparent)] hover:bg-gold-hi"
            >
              Read the latest
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/tools" size="lg" variant="outline">
              <Calculator className="size-4" aria-hidden />
              Run the calculators
            </ButtonLink>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-3.5 text-accent-ink" aria-hidden /> 20,000+ subscribers
            </span>
            <span className="hidden sm:inline text-faint">·</span>
            <span>No paywalls</span>
            <span className="hidden sm:inline text-faint">·</span>
            <span>No tracking</span>
            <span className="hidden sm:inline text-faint">·</span>
            <span>Weekly brief, every Sunday</span>
          </div>
        </div>

        {/* Right — trading-desk panel */}
        <div className="relative">
          <div aria-hidden className="absolute -inset-6 -z-10 rounded-[28px] bg-gold/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Live · NSE</span>
              </div>
              <span className="font-mono text-[10px] text-faint">NIFTY · 1Y</span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
              {[
                { label: "Last", value: "24,512", delta: "+0.62%", up: true },
                { label: "High", value: "24,648", delta: "" },
                { label: "Low", value: "24,201", delta: "" },
              ].map((s) => (
                <div key={s.label} className="px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">{s.label}</p>
                  <p className="tnum mt-1 font-display text-xl font-medium text-foreground">{s.value}</p>
                  {s.delta && <p className="tnum mt-0.5 text-[11px] font-semibold text-emerald-500">{s.delta}</p>}
                </div>
              ))}
            </div>

            <div className="h-60 bg-surface-2 sm:h-72">
              <MarketPulse />
            </div>

            <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-2.5">
              <span className="font-mono text-[10px] text-faint">Illustrative · not live data</span>
              <span className="font-mono text-[10px] text-accent-ink">YTD +12.4%</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
