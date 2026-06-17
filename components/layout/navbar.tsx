"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { MAIN_NAV, SITE } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className="relative grid size-9 place-items-center overflow-hidden rounded-md bg-navy text-gold ring-1 ring-gold/40"
      >
        <span className="absolute inset-x-1 top-1 h-px bg-gold/30" />
        <span className="absolute inset-x-1 bottom-1 h-px bg-gold/30" />
        <span className="font-display text-xl font-medium leading-none">C</span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[1.35rem] font-medium tracking-tight">{SITE.name}</span>
        <span aria-hidden className="eyebrow text-[9px] tracking-[0.22em] text-muted">
          FINANCE · INDIA
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <Container className="flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {MAIN_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-3 -bottom-px h-[2px] bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Search className="size-3.5" aria-hidden />
            <span aria-hidden className="hidden lg:inline">Search</span>
            <kbd aria-hidden className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-faint lg:inline">
              ⌘K
            </kbd>
          </Link>
          <ThemeToggle />
          <Link
            href="/newsletter"
            className="hidden h-9 items-center rounded-md bg-navy px-4 text-xs font-semibold uppercase tracking-wide text-gold ring-1 ring-gold/30 transition-all hover:bg-navy-700 sm:inline-flex"
          >
            Subscribe
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-border bg-background md:hidden" aria-label="Mobile">
          <Container className="flex flex-col py-2">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-surface",
                  isActive(item.href) ? "text-foreground" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
