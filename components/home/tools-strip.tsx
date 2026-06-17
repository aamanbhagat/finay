import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TOOLS } from "@/lib/constants";

export function ToolsStrip() {
  return (
    <section className="relative isolate overflow-hidden border-y border-border bg-surface/40">
      <Container className="py-20">
        <SectionHeading
          serial="03 / 05"
          eyebrow="Instant calculators"
          title="Run the numbers, not your guesses."
          description="Eight calculators with shareable URLs. Change a number, see the answer immediately."
          href="/tools"
          hrefLabel="All tools"
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {TOOLS.map((tool) => {
            return (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-surface-2 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-sm)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-md bg-accent/10 text-accent-ink">
                      <DynamicIcon name={tool.icon} className="size-4" />
                    </span>
                    <ArrowUpRight className="size-4 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink" aria-hidden />
                  </div>
                  <div>
                    <p className="font-display text-base font-medium leading-tight">{tool.name}</p>
                    <p className="mt-1 text-xs text-muted">{tool.short}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
