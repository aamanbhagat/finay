import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  /** The hero result — rendered large with a gold gradient panel. */
  emphasis?: boolean;
  hint?: string;
}

/** Hero result block: emphasized stat large on top, the rest as a compact grid. */
export function ResultSummary({ stats, className }: { stats: Stat[]; className?: string }) {
  const hero = stats.find((s) => s.emphasis);
  const rest = stats.filter((s) => !s.emphasis);

  return (
    <div className={cn("space-y-4", className)}>
      {hero && (
        <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/12 via-surface-2 to-surface-2 p-6">
          <div aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full bg-gold/15 blur-2xl" />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
            {hero.label}
          </p>
          <p className="tnum relative mt-2 font-display text-4xl font-medium leading-none tracking-tight text-foreground sm:text-5xl">
            {hero.value}
          </p>
          {hero.hint && <p className="relative mt-2 text-xs text-muted">{hero.hint}</p>}
        </div>
      )}
      {rest.length > 0 && (
        <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {rest.map((stat) => (
            <div key={stat.label} className="bg-surface-2 p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                {stat.label}
              </dt>
              <dd className="tnum mt-1.5 font-display text-2xl font-medium tracking-tight text-foreground">
                {stat.value}
              </dd>
              {stat.hint && <p className="mt-1 text-xs text-muted">{stat.hint}</p>}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
