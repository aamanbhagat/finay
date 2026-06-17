"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Copies the current calculator URL (with its query-state) to the clipboard. */
export function ShareLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent-ink"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-500" aria-hidden /> Link copied
        </>
      ) : (
        <>
          <Link2 className="size-3.5" aria-hidden /> Share this scenario
        </>
      )}
    </button>
  );
}
