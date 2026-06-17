/**
 * Thin client for the Vercel AI Gateway (OpenAI-compatible Chat Completions).
 * Zero SDK deps — just `fetch` — so it stays portable and future-proof.
 */
import { GATEWAY } from "./config";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  system?: string;
  temperature?: number;
  maxTokens?: number;
  /** Ask the model for a strict JSON object response. */
  json?: boolean;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** One chat completion. Retries on network / 5xx / 429 with backoff. */
export async function chat(prompt: string, opts: ChatOptions = {}): Promise<string> {
  if (!GATEWAY.apiKey) {
    throw new Error(
      "AI_GATEWAY_API_KEY is missing. Add it to .env.local (see .env.example).",
    );
  }

  const messages: Message[] = [];
  if (opts.system) messages.push({ role: "system", content: opts.system });
  messages.push({ role: "user", content: prompt });

  const body: Record<string, unknown> = {
    model: GATEWAY.model,
    messages,
    temperature: opts.temperature ?? 0.7,
  };
  if (opts.maxTokens) body.max_tokens = opts.maxTokens;
  // NB: Anthropic models via the gateway reject OpenAI's `response_format`.
  // We enforce JSON purely through the prompt + tolerant parsing in chatJson().

  let lastErr: unknown;
  for (let attempt = 1; attempt <= GATEWAY.maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GATEWAY.timeoutMs);
    try {
      const res = await fetch(`${GATEWAY.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GATEWAY.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        // Retry transient failures; fail fast on 4xx (except 429).
        if (res.status === 429 || res.status >= 500) {
          throw new Error(`Gateway ${res.status}: ${text.slice(0, 300)}`);
        }
        throw new Error(`Gateway ${res.status} (non-retryable): ${text.slice(0, 300)}`);
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Gateway returned empty content.");
      return content.trim();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("non-retryable")) break;
      if (attempt < GATEWAY.maxRetries) {
        const backoff = 1000 * 2 ** (attempt - 1);
        console.warn(`  ⚠ gateway attempt ${attempt} failed (${msg}); retry in ${backoff}ms`);
        await sleep(backoff);
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`Gateway failed after ${GATEWAY.maxRetries} attempts: ${lastErr}`);
}

/** Chat that parses a JSON object out of the reply, tolerating code fences. */
export async function chatJson<T>(prompt: string, opts: ChatOptions = {}): Promise<T> {
  const raw = await chat(prompt, { ...opts, json: true });
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Last resort: grab the outermost {...} block.
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error(`Could not parse JSON from model:\n${raw.slice(0, 500)}`);
  }
}
