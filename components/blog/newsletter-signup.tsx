"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { newsletterSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterSignupProps {
  source?: string;
  className?: string;
  stacked?: boolean;
}

export function NewsletterSignup({ source = "site", className, stacked }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = newsletterSchema.safeParse({ email, source });
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage("You're on the list. Check your inbox to confirm.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm font-medium text-emerald-500",
          className,
        )}
        role="status"
      >
        <CheckCircle2 className="size-4" aria-hidden /> {message}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
      aria-label="Newsletter signup"
      noValidate
    >
      <div className={cn("flex gap-2", stacked && "flex-col")}>
        <label htmlFor={`nl-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="h-12 w-full rounded-md border border-current/15 bg-current/5 px-4 text-sm outline-none transition placeholder:text-current/40 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40"
          style={{ color: "inherit" }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-gold px-5 text-sm font-semibold text-navy shadow-[0_8px_20px_-6px_rgba(241,181,74,0.4)] transition hover:bg-gold-hi disabled:opacity-60"
        >
          <Send className="size-4" aria-hidden />
          {status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      <p
        className={cn(
          "mt-2.5 text-[11px]",
          status === "error" ? "text-red-500" : "text-current/55",
        )}
        aria-live="polite"
      >
        {status === "error" ? message : "We respect your inbox. Unsubscribe anytime."}
      </p>
    </form>
  );
}
