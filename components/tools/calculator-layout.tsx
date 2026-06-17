import type { ReactNode } from "react";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { ShareLink } from "@/components/tools/share-link";
import { TOOLS } from "@/lib/constants";

interface CalculatorLayoutProps {
  slug: string;
  name: string;
  description: string;
  children: ReactNode;
  faq?: ReactNode;
}

export function CalculatorLayout({ slug, name, description, children, faq }: CalculatorLayoutProps) {
  const others = TOOLS.filter((t) => t.slug !== slug);

  return (
    <>
      {/* Header band */}
      <div className="relative border-b border-border bg-surface/40">
        <div className="ledger-grid absolute inset-0 opacity-30" aria-hidden />
        <Container className="relative py-10 lg:py-14">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }, { name }]}
          />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
                Calculator
              </p>
              <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-tight">
                {name}
              </h1>
              <p className="mt-3 max-w-2xl text-muted">{description}</p>
            </div>
            <ShareLink />
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {children}

        {faq && (
          <section className="mt-16 border-t border-border pt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">FAQ</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
              Questions, answered
            </h2>
            <div className="mt-6 max-w-3xl divide-y divide-border border-y border-border">{faq}</div>
          </section>
        )}

        {/* Related tools */}
        <section className="mt-16 border-t border-border pt-10">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            More calculators
          </p>
          <div className="flex flex-wrap gap-2.5">
            {others.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 py-2 pl-2.5 pr-4 text-sm transition-colors hover:border-accent"
              >
                <span className="grid size-6 place-items-center rounded-full bg-accent/10 text-accent-ink">
                  <DynamicIcon name={t.icon} className="size-3.5" />
                </span>
                <span className="font-medium text-foreground group-hover:text-accent-ink">
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
