import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BlogFiltersProps {
  current?: string;
}

function buildHref(category?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

/** Category chip row used on the blog listing. */
export function BlogFilters({ current }: BlogFiltersProps) {
  return (
    <nav aria-label="Filter by category" className="mb-8">
      <ul className="fade-x flex flex-wrap gap-2">
        <li>
          <Link
            href={buildHref()}
            className={cn(
              "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              !current
                ? "border-accent bg-accent text-navy"
                : "border-border text-muted hover:bg-surface",
            )}
          >
            All
          </Link>
        </li>
        {CATEGORIES.map((category) => {
          const active = current === category.slug;
          return (
            <li key={category.slug}>
              <Link
                href={buildHref(category.slug)}
                className={cn(
                  "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-accent bg-accent text-navy"
                    : "border-border text-muted hover:bg-surface",
                )}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
