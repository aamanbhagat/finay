import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds an href for any page number (lets callers preserve filters). */
  hrefForPage: (page: number) => string;
}

function pageRange(current: number, total: number): (number | "…")[] {
  const range: (number | "…")[] = [];
  const window = 1;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - window && i <= current + window)) {
      range.push(i);
    } else if (range[range.length - 1] !== "…") {
      range.push("…");
    }
  }
  return range;
}

export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = pageRange(page, totalPages);
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
      <Link
        href={hrefForPage(Math.max(1, page - 1))}
        aria-label="Previous page"
        aria-disabled={page === 1}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-(--radius) border border-border text-muted transition-colors hover:bg-surface",
          page === 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </Link>
      {items.map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-muted">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefForPage(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-(--radius) border text-sm font-medium transition-colors",
              item === page
                ? "border-accent bg-accent text-navy"
                : "border-border text-muted hover:bg-surface",
            )}
          >
            {item}
          </Link>
        ),
      )}
      <Link
        href={hrefForPage(Math.min(totalPages, page + 1))}
        aria-label="Next page"
        aria-disabled={page === totalPages}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-(--radius) border border-border text-muted transition-colors hover:bg-surface",
          page === totalPages && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </nav>
  );
}
