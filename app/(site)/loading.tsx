import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="py-14">
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-surface" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-surface" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface-2">
            <div className="aspect-[16/9] animate-pulse bg-surface" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-16 animate-pulse rounded bg-surface" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
