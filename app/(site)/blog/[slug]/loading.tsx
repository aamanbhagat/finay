import { Container } from "@/components/ui/container";

export default function ArticleLoading() {
  return (
    <Container className="py-14">
      <div className="space-y-4">
        <div className="h-3 w-40 animate-pulse rounded bg-surface" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-surface" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-surface" />
        <div className="aspect-[16/8] animate-pulse rounded-lg bg-surface" />
      </div>
      <div className="mt-10 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-surface"
            style={{ width: `${65 + ((i * 11) % 30)}%` }}
          />
        ))}
      </div>
    </Container>
  );
}
