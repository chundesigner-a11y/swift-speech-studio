import { redirect } from "next/navigation";

// Old links used /auth?mode=signup|signin — send them to the new paths.
export default async function Page({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  redirect(mode === "signup" ? "/sign-up" : "/sign-in");
}
