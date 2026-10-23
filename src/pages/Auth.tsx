import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { usePageMeta } from "@/hooks/use-page-meta";

export function AuthPage({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  usePageMeta({
    title: isSignup ? "Sign up — Video Speed Reader" : "Sign in — Video Speed Reader",
    description: "Sign in or create your Video Speed Reader account.",
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/app" } })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    if (!data.session) return setError("Check your email to confirm your account.");
    navigate("/app", { replace: true });
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : isSignup ? "Sign up" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "No account yet? "}
            <Link to={isSignup ? "/sign-in" : "/sign-up"} className="text-primary hover:underline">
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
