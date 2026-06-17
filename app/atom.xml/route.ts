import { buildFeed } from "@/lib/feed";

export const revalidate = 3600;

export function GET() {
  return new Response(buildFeed().atom1(), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
