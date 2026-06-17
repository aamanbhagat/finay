import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/content";
import { CATEGORIES, type Category } from "@/lib/constants";
import { Container } from "@/components/ui/container";

interface TopicEntry {
  category: Category;
  posts: Post[];
}

interface TopicsIndexProps {
  entries: TopicEntry[];
}

function TopicRow({ entry, n }: { entry: TopicEntry; n: number }) {
  const { category, posts } = entry;
  const latest = posts.slice(0, 2);
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative grid gap-6 border-b border-border py-10 transition-colors last:border-b-0 hover:bg-surface-2/60 md:grid-cols-[1fr_1.6fr] md:items-start md:gap-12"
    >
      {/* Left rail: accent bar + serial + name + desc */}
      <div className="relative pl-6">
        <span
          aria-hidden
          className="absolute left-0 top-1.5 h-12 w-[3px] rounded-full transition-all duration-300 group-hover:h-16"
          style={{ background: category.accent }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
          {String(n).padStart(2, "0")} · {category.slug}
        </span>
        <h3 className="mt-2 font-display text-3xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-4xl">
          {category.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{category.description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-faint">
            {posts.length} {posts.length === 1 ? "story" : "stories"}
          </span>
          <ArrowUpRight
            className="size-3.5 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ color: category.accent }}
            aria-hidden
          />
        </div>
      </div>

      {/* Right: latest article titles */}
      <ol className="space-y-5">
        {latest.length === 0 && <li className="text-sm italic text-faint">Coming soon.</li>}
        {latest.map((post, i) => (
          <li key={post.slug} className="flex gap-5 border-b border-border pb-5 last:border-b-0">
            <span className="w-8 shrink-0 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              №{String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <span className="block font-display text-lg font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent-ink">
                {post.frontmatter.title}
              </span>
              <p className="mt-1.5 line-clamp-1 text-sm text-muted">{post.frontmatter.description}</p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {post.readingTimeMinutes} min read
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Link>
  );
}

export function TopicsIndex({ entries }: TopicsIndexProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-border bg-surface/40">
      <Container className="relative py-24">
        <div className="mb-16 border-b border-border pb-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-ink">
                The Index · Six Beats
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[0.95] tracking-tight text-foreground">
                Every section,{" "}
                <em className="italic text-accent-ink" style={{ fontVariationSettings: "'SOFT' 100" }}>
                  one publication.
                </em>
              </h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 border-b border-accent/40 pb-1 font-mono text-xs uppercase tracking-[0.18em] text-accent-ink transition-colors hover:border-accent"
            >
              Full archive
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </Link>
          </div>
        </div>

        <ol>
          {entries.map((entry, i) => (
            <li key={entry.category.slug}>
              <TopicRow entry={entry} n={i + 1} />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/** Helper used by the homepage to assemble the entries. */
export function buildTopicEntries(allPosts: Post[]): TopicEntry[] {
  return CATEGORIES.map((category) => ({
    category,
    posts: allPosts.filter((p) => p.frontmatter.category === category.slug),
  }));
}
