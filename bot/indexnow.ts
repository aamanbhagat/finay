/**
 * IndexNow — instant URL submission to Bing, Yandex, Seznam, Naver.
 * Google ignores IndexNow but uses its own Search-Console signals; this is a
 * pure win for the long tail of other engines and gets new articles indexed in
 * minutes instead of weeks. Zero account required.
 *
 * Flow:
 *  1. On first use, generate a stable 32-char key (persisted in memory.json).
 *  2. Write `public/<key>.txt` containing the key (verification file).
 *  3. After deploy, POST the new URLs to api.indexnow.org.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT } from "./config";
import type { Memory } from "./types";

const PUBLIC = path.join(ROOT, "public");

export function ensureKey(mem: Memory): string {
  if (!mem.indexNowKey) {
    mem.indexNowKey = crypto.randomBytes(16).toString("hex");
  }
  const keyFile = path.join(PUBLIC, `${mem.indexNowKey}.txt`);
  if (!fs.existsSync(keyFile)) {
    fs.mkdirSync(PUBLIC, { recursive: true });
    fs.writeFileSync(keyFile, mem.indexNowKey, "utf8");
  }
  return mem.indexNowKey;
}

interface PingArgs {
  siteUrl: string;
  urls: string[];
  key: string;
}

/** POST URLs to IndexNow. Returns true on 200/202. */
export async function pingIndexNow({ siteUrl, urls, key }: PingArgs): Promise<boolean> {
  if (!urls.length) return false;
  const host = new URL(siteUrl).host;
  const body = {
    host,
    key,
    keyLocation: `${siteUrl.replace(/\/$/, "")}/${key}.txt`,
    urlList: urls,
  };
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    return res.status === 200 || res.status === 202;
  } catch {
    return false;
  }
}
