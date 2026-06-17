/**
 * Drain `memory.pendingPings` to IndexNow. Runs in CI AFTER the live site has
 * been deployed (so the verification key file is reachable). Clears successful
 * URLs; failures stay queued for the next run.
 *
 *   pnpm bot:ping
 */
import "./env";
import { loadMemory, saveMemory } from "./memory";
import { ensureKey, pingIndexNow } from "./indexnow";
import { SITE } from "../lib/constants";

async function main(): Promise<void> {
  const mem = loadMemory();
  const raw = mem.pendingPings ?? [];
  if (!raw.length) {
    console.log("nothing to ping.");
    return;
  }
  // Rewrite each URL's host to match the CURRENT NEXT_PUBLIC_SITE_URL — so a
  // queue bootstrapped on localhost still pings the right domain in prod.
  const base = SITE.url.replace(/\/$/, "");
  const urls = [...new Set(raw.map((u) => {
    try {
      const parsed = new URL(u);
      return `${base}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return `${base}${u.startsWith("/") ? u : `/${u}`}`;
    }
  }))];
  const key = ensureKey(mem);
  console.log(`pinging IndexNow with ${urls.length} URL(s)…`);
  const ok = await pingIndexNow({ siteUrl: SITE.url, urls, key });
  if (ok) {
    console.log("✓ accepted by IndexNow. Clearing queue.");
    mem.pendingPings = [];
    saveMemory(mem);
  } else {
    console.warn("✗ IndexNow rejected the ping; URLs stay queued.");
    saveMemory(mem); // persist key even if ping failed
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("ping failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
