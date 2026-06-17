import { Container } from "@/components/ui/container";

export default function ToolLoading() {
  return (
    <Container className="py-14">
      <div className="space-y-4">
        <div className="h-3 w-32 animate-pulse rounded bg-surface" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-surface" />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="h-80 animate-pulse rounded-lg bg-surface" />
        <div className="h-80 animate-pulse rounded-lg bg-surface" />
      </div>
    </Container>
  );
}
