import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-bold text-accent-ink">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you're looking for has moved, been deleted, or never existed. The math still
        works, though.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/blog" variant="outline">
          Browse articles
        </ButtonLink>
        <Link
          href="/search"
          className="inline-flex items-center text-sm font-medium text-accent-ink hover:underline"
        >
          Search the site →
        </Link>
      </div>
    </Container>
  );
}
