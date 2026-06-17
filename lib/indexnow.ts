import { SITE } from "@/lib/constants";

/**
 * Ping IndexNow so Bing / Yandex / Seznam re-crawl quickly after a publish.
 * No-op when INDEXNOW_KEY is unset, so it's safe in dev and Phase A.
 *
 * Setup: drop `<INDEXNOW_KEY>.txt` containing the key into `/public` and set
 * INDEXNOW_KEY in the environment. Then call from a Server Action or `after()`
 * after the new content is live:
 *   import { after } from "next/server";
 *   after(() => pingIndexNow([absoluteUrl(`/blog/${slug}`)]));
 */
export async function pingIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || urls.length === 0) return;

  const host = SITE.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const body = {
    host,
    key,
    keyLocation: `${SITE.url}/${key}.txt`,
    urlList: urls,
  };

  try {
    await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Keep this off the request hot path.
      cache: "no-store",
    });
  } catch {
    /* IndexNow failures are non-critical — log and move on */
  }
}
