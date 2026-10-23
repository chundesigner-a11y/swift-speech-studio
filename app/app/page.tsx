import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHomePage } from "@/views/AppHome";

export const metadata: Metadata = {
  title: "Dashboard — Video Speed Reader",
  description: "Your Video Speed Reader dashboard.",
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  return <AppHomePage email={user.email ?? ""} />;
}
