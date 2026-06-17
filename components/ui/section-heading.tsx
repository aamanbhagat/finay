import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  eyebrow?: string;
  serial?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  /** Heading level for the title. Use "h1" for the primary page heading. */
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  serial,
  title,
  description,
  href,
  hrefLabel = "View all",
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          {serial && <span className="font-mono text-xs text-faint">{serial}</span>}
          {eyebrow && (
            <>
              {serial && <span className="h-px w-8 bg-border-strong" />}
              <span className="eyebrow text-accent-ink">{eyebrow}</span>
            </>
          )}
        </div>
        <Heading className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.05] tracking-tight">
          {title}
        </Heading>
        {description && (
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:border-accent hover:bg-accent hover:text-navy"
        >
          {hrefLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
