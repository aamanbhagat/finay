import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="inline-flex items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-accent-ink"
                  aria-current={last ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-foreground/80">
                  {item.name}
                </span>
              )}
              {!last && <ChevronRight className="size-3" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
