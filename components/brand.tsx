import { Hammer } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** App wordmark — shared by the site header and footer. */
export function Brand({
  showVersion = false,
  className,
}: {
  showVersion?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Hammer className="size-4" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Prompt Forge</span>
      {showVersion && (
        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          V1
        </span>
      )}
    </Link>
  );
}
