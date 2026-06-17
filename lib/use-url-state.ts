"use client";

import { useEffect, useState } from "react";

type Setters<T extends Record<string, number>> = {
  [K in keyof T]: (next: number) => void;
};

/**
 * Number-only URL-synced state hook for calculator inputs.
 * - Reads initial values from `?key=number` (falling back to defaults).
 * - Pushes updates to the URL with `history.replaceState` so /tools URLs are shareable.
 */
export function useUrlNumberState<T extends Record<string, number>>(
  defaults: T,
): [T, Setters<T>] {
  const [state, setState] = useState<T>(defaults);

  // Hydrate from URL after mount (avoids SSR/CSR divergence).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const next = { ...defaults };
    let changed = false;
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const raw = params.get(String(key));
      if (raw !== null) {
        const num = Number(raw);
        if (Number.isFinite(num)) {
          (next[key] as number) = num;
          changed = true;
        }
      }
    }
    if (changed) setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One setter per key. The URL write happens in the event handler (not inside
  // the setState updater) so it never runs during render.
  const setters = Object.fromEntries(
    (Object.keys(defaults) as (keyof T)[]).map((key) => {
      const fn = (next: number) => {
        setState((prev) => ({ ...prev, [key]: next }));
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          params.set(String(key), String(next));
          window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
        }
      };
      return [key, fn];
    }),
  ) as Setters<T>;

  return [state, setters];
}
