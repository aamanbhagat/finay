/**
 * Self-learning memory. A single JSON file the bot reads at the start of every
 * run and writes back at the end. It is what makes the bot "remember" what it
 * already wrote, which clusters it's building, and the lessons it left itself.
 */
import fs from "node:fs";
import { MEMORY_FILE } from "./config";
import type { Memory, RunRecord } from "./types";
import type { Phase } from "./config";

const EMPTY: Memory = {
  version: 1,
  siteBirth: null,
  lastRunAt: null,
  runs: [],
  usedKeywords: [],
  usedTitles: [],
  usedSlugs: [],
  clusters: {},
  phaseHistory: [],
  notes: [],
};

export function loadMemory(): Memory {
  if (!fs.existsSync(MEMORY_FILE)) return structuredClone(EMPTY);
  try {
    const parsed = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8")) as Partial<Memory>;
    return { ...structuredClone(EMPTY), ...parsed };
  } catch {
    console.warn("  ⚠ memory.json unreadable; starting fresh.");
    return structuredClone(EMPTY);
  }
}

export function saveMemory(mem: Memory): void {
  fs.writeFileSync(MEMORY_FILE, `${JSON.stringify(mem, null, 2)}\n`, "utf8");
}

const dedupe = (arr: string[]) => [...new Set(arr.map((s) => s.trim()).filter(Boolean))];

/** Fold one published article into memory + record a phase transition. */
export function recordRun(
  mem: Memory,
  record: RunRecord,
  tags: string[],
  notes: string[],
): Memory {
  mem.runs.push(record);
  mem.lastRunAt = record.ts;
  mem.usedKeywords = dedupe([...mem.usedKeywords, record.primaryKeyword]);
  mem.usedTitles = dedupe([...mem.usedTitles, record.title]);
  mem.usedSlugs = dedupe([...mem.usedSlugs, record.slug]);

  // Build/extend clusters by tag so siblings can be interlinked next time.
  for (const tag of tags) {
    const cluster = mem.clusters[tag] ?? { members: [], primaryKeywords: [] };
    cluster.members = dedupe([...cluster.members, record.slug]);
    cluster.primaryKeywords = dedupe([...cluster.primaryKeywords, record.primaryKeyword]);
    mem.clusters[tag] = cluster;
  }

  const lastPhase = mem.phaseHistory.at(-1)?.phase;
  if (lastPhase !== record.phase) {
    mem.phaseHistory.push({ ts: record.ts, phase: record.phase });
  }

  // Keep the lessons list focused — most recent 20.
  mem.notes = dedupe([...mem.notes, ...notes]).slice(-20);
  return mem;
}

export function setPhase(mem: Memory, phase: Phase): void {
  if (mem.phaseHistory.at(-1)?.phase !== phase) {
    mem.phaseHistory.push({ ts: new Date().toISOString(), phase });
  }
}
