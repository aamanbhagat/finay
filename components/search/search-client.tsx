"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse, { type IFuseOptions } from "fuse.js";
import { Search as SearchIcon } from "lucide-react";
import { CategoryBadge } from "@/components/ui/category-badge";
import { formatDate } from "@/lib/utils";

interface IndexedPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
}

const FUSE_OPTIONS: IFuseOptions<IndexedPost> = {
  keys: [
    { name: "title", weight: 0.55 },
    { name: "description", weight: 0.25 },
    { name: "tags", weight: 0.15 },
    { name: "category", weight: 0.05 },
  ],
  threshold: 0.36,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<IndexedPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/search-index")
      .then((r) => r.json())
      .then((data: IndexedPost[]) => !cancelled && setPosts(data))
      .catch(() => !cancelled && setPosts([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const fuse = useMemo(() => (posts ? new Fuse(posts, FUSE_OPTIONS) : null), [posts]);

  const results = useMemo(() => {
    if (!fuse || !query.trim()) return posts ?? [];
    return fuse.search(query.trim()).map((r) => r.item);
  }, [fuse, posts, query]);

  return (
    <div>
      <label htmlFor="search" className="sr-only">
        Search articles
      </label>
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          id="search"
          type="search"
          autoFocus
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, tags, topics…"
          className="h-12 w-full rounded-lg border border-border bg-surface pl-11 pr-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        {posts === null
          ? "Loading index…"
          : `${results.length} ${results.length === 1 ? "result" : "results"}`}
        {query.trim() && ` for “${query.trim()}”`}
      </p>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {results.map((post) => (
          <li key={post.slug} className="py-5">
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="mb-1 flex items-center gap-3 text-xs text-muted">
                <CategoryBadge slug={post.category} asLink={false} />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent-ink">
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {posts !== null && results.length === 0 && query.trim() && (
        <p className="mt-8 rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No matches. Try a broader keyword.
        </p>
      )}
    </div>
  );
}
