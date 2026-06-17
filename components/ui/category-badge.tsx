import Link from "next/link";
import { getCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  slug: string;
  className?: string;
  asLink?: boolean;
}

/** Small category pill, tinted with the category's accent hue. */
export function CategoryBadge({ slug, className, asLink = true }: CategoryBadgeProps) {
  const category = getCategory(slug);
  if (!category) return null;

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        className,
      )}
      style={{
        color: category.accent,
        backgroundColor: `color-mix(in oklab, ${category.accent} 14%, transparent)`,
      }}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{ backgroundColor: category.accent }}
      />
      {category.name}
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href={`/category/${category.slug}`} aria-label={`${category.name} articles`}>
      {content}
    </Link>
  );
}
