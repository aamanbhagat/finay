import { buildFeed } from "@/lib/feed";

export const revalidate = 3600;

export function GET() {
  return new Response(buildFeed().json1(), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
