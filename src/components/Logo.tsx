import Link from "next/link";
import { Zap } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Zap className="h-4 w-4" />
      </span>
      <span>Video Speed Reader</span>
    </Link>
  );
}
