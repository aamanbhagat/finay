/**
 * Loads .env.local BEFORE any other bot module reads process.env.
 * Must be the FIRST import in run.ts — ES module evaluation follows import order,
 * so importing this first guarantees env vars exist when config.ts is evaluated.
 * In CI the vars come from the environment directly, so a missing file is fine.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  /* no .env.local (e.g. CI) — rely on real env */
}
