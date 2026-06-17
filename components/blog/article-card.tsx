import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/content";
import { getAuthor } from "@/lib/content";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, toISODate, cn } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/constants";

interface ArticleCardProps {
  post: Post;
  priority?: boolean;
  className?: string;
  /** Magazine-style large card for the featured slot. */
  variant?: "default" | "feature";
}

export function ArticleCard({
  post,
  priority = false,
  className,
  variant = "default",
}: ArticleCardProps) {
  const { slug, frontmatter, readingTimeMinutes } = post;
  const author = getAuthor(frontmatter.author);
  const isFeature = variant === "feature";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:border-border-strong",
        isFeature && "lg:flex-row",
        className,
      )}
    >
      <Link
        href={`/blog/${slug}`}
        className={cn(
          "relative block overflow-hidden bg-surface",
          isFeature ? "aspect-[16/10] lg:w-3/5" : "aspect-[16/9]",
        )}
      >
        {frontmatter.cover ? (
          <>
            <Image
              src={frontmatter.cover}
              alt={frontmatter.coverAlt ?? frontmatter.title}
              fill
              sizes={isFeature ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              priority={priority}
              className="img-zoom object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </>
        ) : (
          <div className="ledger-grid size-full" aria-hidden />
        )}
        {frontmatter.sponsored && (
          <span className="absolute right-3 top-3 rounded-full bg-navy/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold backdrop-blur">
            Sponsored
          </span>
        )}
        <span
          aria-hidden
          className="absolute right-3 top-3 grid size-8 translate-y-1 place-items-center rounded-full bg-gold text-navy opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </Link>

      <div className={cn("flex flex-1 flex-col p-6", isFeature && "lg:p-8")}>
        <div className="mb-3 flex items-center gap-3">
          <CategoryBadge slug={frontmatter.category} />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            {formatDate(frontmatter.publishedAt)}
          </span>
        </div>
        <h3
          className={cn(
            "font-display font-medium leading-tight tracking-tight",
            isFeature ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl",
          )}
        >
          <Link href={`/blog/${slug}`} className="bg-[length:100%_2px] bg-bottom bg-no-repeat transition-colors group-hover:text-accent-ink">
            {frontmatter.title}
          </Link>
        </h3>
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed text-muted",
            isFeature ? "lg:text-base lg:line-clamp-3" : "line-clamp-2",
          )}
        >
          {frontmatter.description}
        </p>

        <div className="mt-5 flex items-center gap-2.5 border-t border-border pt-4 text-xs text-muted">
          {author && (
            <>
              <Avatar name={author.frontmatter.name} src={author.frontmatter.avatar} size={26} />
              <Link
                href={`/author/${author.slug}`}
                className="font-medium text-foreground/85 hover:text-accent-ink"
              >
                {author.frontmatter.name}
              </Link>
              <span aria-hidden className="text-faint">·</span>
            </>
          )}
          <time dateTime={toISODate(frontmatter.publishedAt)}>
            {formatDate(frontmatter.publishedAt)}
          </time>
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px]">
            <Clock className="size-3" aria-hidden />
            {readingTimeMinutes} MIN
          </span>
        </div>
      </div>
    </article>
  );
}
