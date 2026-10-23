import { useEffect, useState } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = { status: "loading" } | { status: "signed-out" } | { status: "signed-in"; user: User };

// Guards /app: checks the Supabase user in the browser and sends signed-out
// visitors to /sign-in, the same rule the old `_authenticated` route enforced.
export function RequireAuth() {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setState(data.user ? { status: "signed-in", user: data.user } : { status: "signed-out" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setState(session?.user ? { status: "signed-in", user: session.user } : { status: "signed-out" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state.status === "loading") return null;
  if (state.status === "signed-out") return <Navigate to="/sign-in" replace />;
  return <Outlet context={{ user: state.user } satisfies AuthContext} />;
}

type AuthContext = { user: User };

export function useAuthUser() {
  return useOutletContext<AuthContext>().user;
}
