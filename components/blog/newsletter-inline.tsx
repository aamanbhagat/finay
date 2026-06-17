import { Mail } from "lucide-react";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";

interface NewsletterInlineProps {
  heading?: string;
  body?: string;
  source?: string;
}

/** Boxed newsletter CTA for mid-article and end-of-article placement. */
export function NewsletterInline({
  heading = "The five-minute money brief",
  body = "Markets, tax changes, and one practical money move — every week. Join 20,000+ readers.",
  source = "article-inline",
}: NewsletterInlineProps) {
  return (
    <aside className="not-prose ledger-grid my-10 rounded-lg border border-border bg-surface p-6 sm:p-8">
      <div className="mb-4 flex items-center gap-2 text-accent-ink">
        <Mail className="size-5" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-widest">Newsletter</span>
      </div>
      <h3 className="mb-2 font-display text-xl font-semibold">{heading}</h3>
      <p className="mb-4 max-w-prose text-sm text-muted">{body}</p>
      <NewsletterSignup source={source} className="max-w-md" />
    </aside>
  );
}
