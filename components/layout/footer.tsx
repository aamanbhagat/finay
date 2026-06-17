import Link from "next/link";
import { Rss } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { XIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { SITE, FOOTER_NAV, SOCIAL_LINKS } from "@/lib/constants";

const SOCIAL_ICONS = { Twitter: XIcon, Linkedin: LinkedInIcon, Rss } as const;

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-navy text-white">
      {/* Top hairline gold */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        aria-hidden
        style={{ background: "linear-gradient(90deg, transparent, rgba(241,181,74,0.5), transparent)" }}
      />
      <div className="aurora absolute inset-0 opacity-50" aria-hidden />

      <Container className="relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-10 place-items-center rounded-md bg-gold/15 text-gold ring-1 ring-gold/40"
            >
              <span className="font-display text-lg font-medium leading-none">C</span>
            </span>
            <p className="font-display text-2xl font-medium tracking-tight text-white">
              {SITE.name}
            </p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{SITE.description}</p>
          <div className="mt-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
              Weekly dispatch
            </p>
            <p className="mt-2 font-display text-lg text-white">Five minutes of money. Every Sunday.</p>
            <NewsletterSignup source="footer" className="mt-4 max-w-md" />
          </div>
          <div className="mt-7 flex gap-2">
            {SOCIAL_LINKS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon as keyof typeof SOCIAL_ICONS];
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Icon className="size-4" aria-hidden />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-7">
          {Object.entries(FOOTER_NAV).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                {heading}
              </p>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/75 transition-colors hover:text-gold"
                    >
                      <span className="size-1 rounded-full bg-white/20 transition-colors group-hover:bg-gold" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.14em]">
            © {new Date().getFullYear()} {SITE.name} · Made in India
          </p>
          <p className="max-w-2xl sm:text-right">
            Content is for education only and is not financial, investment, or tax advice.
            Markets carry risk; consult a registered adviser before acting.
          </p>
        </Container>
      </div>
    </footer>
  );
}
