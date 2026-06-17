import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validators";

/**
 * Newsletter subscribe endpoint.
 * Phase A: validates + logs (no-op when Supabase/Resend env is absent).
 * Phase B: inserts into Supabase `subscribers` and sends a double opt-in via Resend.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 422 },
    );
  }

  const { email, source } = parsed.data;

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseConfigured) {
    // Graceful fallback until Phase B credentials are supplied.
    console.info(`[newsletter] subscribe (mock): ${email} from ${source ?? "unknown"}`);
    return NextResponse.json({ ok: true, mock: true });
  }

  // Phase B wiring lands here (Supabase insert + Resend confirmation email).
  return NextResponse.json({ ok: true });
}
