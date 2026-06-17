"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/content";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

/** Sticky TOC that highlights the section currently in view. */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    );
    const targets = items.map((item) => document.getElementById(item.slug)).filter(Boolean);
    targets.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border">
        {items.map((item) => {
          const active = item.slug === activeSlug;
          return (
            <li key={item.slug} className={cn(item.depth === 3 && "pl-3")}>
              <a
                href={`#${item.slug}`}
                className={cn(
                  "-ml-px block border-l-2 py-0.5 pl-3 leading-snug transition-colors",
                  active
                    ? "border-accent font-medium text-foreground"
                    : "border-transparent text-muted hover:text-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
