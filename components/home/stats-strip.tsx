import { Container } from "@/components/ui/container";

const STATS = [
  { value: "20k+", label: "Subscribers" },
  { value: "8", label: "Calculators" },
  { value: "6", label: "Topics covered" },
  { value: "₹0", label: "Forever paywall" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-surface/60">
      <Container className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="px-6 py-8 first:pl-0 md:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="tnum mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
