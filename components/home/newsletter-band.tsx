import { Mail, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";

const PROMISES = [
  "Markets recap in 60 seconds",
  "One tax or money move per week",
  "Free, forever — unsubscribe anytime",
];

export function NewsletterBand() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border">
      <div className="aurora absolute inset-0 opacity-60" aria-hidden />
      <div className="ledger-grid absolute inset-0 opacity-40" aria-hidden />
      <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-ink">
            № 047 · Weekly Dispatch
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1] tracking-tight text-foreground">
            The five-minute{" "}
            <em className="italic text-accent-ink" style={{ fontVariationSettings: "'SOFT' 100" }}>
              money brief
            </em>
            .
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            One Sunday email: the market moves that mattered, a tax or money tip you can use, and
            one chart worth your time.
          </p>
          <ul className="mt-7 space-y-2.5">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-foreground/80">
                <CheckCircle2 className="size-4 text-accent-ink" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -inset-4 -z-10 rounded-3xl bg-gold/10 blur-2xl" />
          <div className="rounded-2xl border border-border bg-surface-2 p-8 shadow-[var(--shadow-lg)]">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-gold/15 text-accent-ink">
                <Mail className="size-4" aria-hidden />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  Sundays · 7:00 IST
                </p>
                <p className="font-display text-base text-foreground">Join 20,000+ readers</p>
              </div>
            </div>
            <NewsletterSignup source="home-band" />
            <p className="mt-4 text-[11px] text-faint">
              No spam. No tracking pixels. Sponsored mentions are clearly labelled.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
