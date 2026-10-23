import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Landing spot for the link in the sign-up confirmation email.
// Supabase sends the user here with a one-time ?code=, which we swap for a
// session cookie so they arrive on the dashboard already signed in.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${destination}`);
  }

  // Link expired or was opened in a different browser: the email is still
  // confirmed, so ask them to sign in.
  return NextResponse.redirect(`${origin}/sign-in?confirmed=1`);
}
