import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";

interface ProsePageProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Shared frame for About / Contact / Advertise / Privacy. */
export function ProsePage({ eyebrow, title, description, children }: ProsePageProps) {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-accent-ink">
        {eyebrow}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>}
      <div className="prose prose-neutral mt-10 max-w-3xl dark:prose-invert prose-headings:font-display prose-a:text-accent-ink">
        {children}
      </div>
    </Container>
  );
}
