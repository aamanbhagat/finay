import Link from "next/link";
import type { Author } from "@/lib/content";
import { Avatar } from "@/components/ui/avatar";
import { XIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { Globe } from "lucide-react";

const LINK_BTN =
  "inline-flex size-8 items-center justify-center rounded-(--radius) border border-border text-muted transition-colors hover:bg-surface hover:text-foreground";

export function AuthorCard({ author }: { author: Author }) {
  const { name, role, avatar, bio, twitter, linkedin, website } = author.frontmatter;
  return (
    <aside className="not-prose flex flex-col items-start gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center">
      <Link href={`/author/${author.slug}`} aria-label={`Articles by ${name}`}>
        <Avatar name={name} src={avatar} size={64} />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">{role}</p>
        <p className="font-display text-lg font-semibold">
          <Link href={`/author/${author.slug}`} className="hover:text-accent-ink">
            {name}
          </Link>
        </p>
        <p className="mt-1 text-sm text-muted">{bio}</p>
        {(twitter || linkedin || website) && (
          <div className="mt-3 flex gap-2">
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label={`${name} on X`} className={LINK_BTN}>
                <XIcon className="size-3.5" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`} className={LINK_BTN}>
                <LinkedInIcon className="size-3.5" />
              </a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s website`} className={LINK_BTN}>
                <Globe className="size-3.5" aria-hidden />
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
