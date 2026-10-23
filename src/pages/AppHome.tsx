import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuthUser } from "@/components/RequireAuth";
import { usePageMeta } from "@/hooks/use-page-meta";

export function AppHomePage() {
  const user = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  usePageMeta({ title: "Dashboard — Video Speed Reader", description: "Your Video Speed Reader dashboard." });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Button variant="secondary" onClick={signOut}><LogOut /> Sign out</Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 animate-in fade-in duration-500">
        <h1 className="text-3xl font-semibold break-all">Hi {user.email}</h1>
        <div className="mt-8 rounded-2xl border border-dashed bg-card p-10 text-muted-foreground">
          Your dashboard is coming soon. Upload functionality will be added in the next milestone.
        </div>
      </main>
    </div>
  );
}
