"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export function AppHomePage({ email }: { email: string }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/upload"><Upload /> Upload</Link>
            </Button>
            <Button variant="secondary" onClick={signOut}><LogOut /> Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 animate-in fade-in duration-500">
        <h1 className="text-3xl font-semibold break-all">Hi {email}</h1>
        <div className="mt-8 rounded-2xl border border-dashed bg-card p-10 text-muted-foreground">
          Your dashboard is coming soon. Upload functionality will be added in the next milestone.
        </div>
      </main>
    </div>
  );
}
