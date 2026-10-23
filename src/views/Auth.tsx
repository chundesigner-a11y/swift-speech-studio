"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export function AuthPage({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  // Arriving from the confirmation email (?confirmed=1): tell them it worked.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("confirmed")) {
      setNotice("Your email is confirmed. Sign in to continue. / 信箱已確認，請登入。");
    }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth/callback" } })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    if (!data.session) {
      return setNotice("Almost done — we sent a confirmation link to " + email + ". Open it to finish signing up. / 已寄出確認信，請到信箱點連結完成註冊。");
    }
    router.replace("/app");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <header className="relative mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6"><Logo /></header>
      <main className="relative flex flex-1 items-center justify-center px-4 pb-16">
        <form key={mode} onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border bg-card p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div>
            <h1 className="text-2xl font-semibold">{isSignup ? "Create account / 註冊" : "Sign in / 登入"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{isSignup ? "Start turning videos into transcripts." : "Welcome back."}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {notice && <p role="status" className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">{notice}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : isSignup ? "Sign up" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "No account yet? "}
            <Link href={isSignup ? "/sign-in" : "/sign-up"} className="text-primary hover:underline">
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
