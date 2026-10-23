import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/integrations/supabase/types";

// Browser-side Supabase client. The session lives in cookies so server
// components and route handlers can read the same signed-in user.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
