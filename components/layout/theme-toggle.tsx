"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

function getSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(notify: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* private mode — ignore */
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      <Sun className="size-5 dark:hidden" aria-hidden />
      <Moon className="hidden size-5 dark:block" aria-hidden />
    </button>
  );
}
