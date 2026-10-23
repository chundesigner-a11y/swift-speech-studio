import type { Metadata } from "next";
import { AuthPage } from "@/views/Auth";

export const metadata: Metadata = {
  title: "Sign up — Video Speed Reader",
  description: "Sign in or create your Video Speed Reader account.",
};

export default function Page() {
  return <AuthPage mode="signup" />;
}
