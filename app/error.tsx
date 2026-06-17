"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-bold text-accent-ink">!</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Something went sideways</h1>
      <p className="mt-3 max-w-md text-muted">
        An unexpected error stopped this page from loading. We've been notified.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted">
          Reference: <code className="tnum">{error.digest}</code>
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="outline">
          Back home
        </ButtonLink>
      </div>
    </Container>
  );
}
