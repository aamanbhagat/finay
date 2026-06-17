"use client";

import { useSyncExternalStore } from "react";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const LIKE_KEY = "compound.likes";
const BOOKMARK_KEY = "compound.bookmarks";

function readSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
    // Notify same-tab listeners; "storage" only fires across tabs.
    window.dispatchEvent(new Event("compound.storage"));
  } catch {
    /* quota / private mode — ignore */
  }
}

function subscribe(notify: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", notify);
  window.addEventListener("compound.storage", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("compound.storage", notify);
  };
}

function useSetContains(key: string, slug: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => readSet(key).has(slug),
    () => false, // SSR snapshot — nothing stored yet
  );
}

interface ReactionsProps {
  slug: string;
}

/** Local-storage backed like + bookmark. Swap for Supabase in Phase B. */
export function Reactions({ slug }: ReactionsProps) {
  const liked = useSetContains(LIKE_KEY, slug);
  const bookmarked = useSetContains(BOOKMARK_KEY, slug);

  function toggle(kind: "like" | "bookmark") {
    const key = kind === "like" ? LIKE_KEY : BOOKMARK_KEY;
    const set = readSet(key);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    writeSet(key, set);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => toggle("like")}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-(--radius) border border-border transition-colors hover:bg-surface",
          liked ? "text-red-500" : "text-muted hover:text-foreground",
        )}
      >
        <Heart className={cn("size-4", liked && "fill-current")} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => toggle("bookmark")}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-(--radius) border border-border transition-colors hover:bg-surface",
          bookmarked ? "text-accent-ink" : "text-muted hover:text-foreground",
        )}
      >
        <Bookmark className={cn("size-4", bookmarked && "fill-current")} aria-hidden />
      </button>
    </div>
  );
}
