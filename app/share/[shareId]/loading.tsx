import { Hammer } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Shown while share/[shareId]/page.tsx awaits forge.getPublic — mirrors SharedForge. */
export default function ShareLoading() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <Link
        href="/chat"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Hammer className="size-4" />
        </div>
        Prompt Forge
      </Link>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {/* title */}
            <Skeleton className="h-5 w-2/5" />
            {/* badges */}
            <div className="mt-1 flex flex-wrap gap-1">
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
          </div>
          {/* copy button */}
          <Skeleton className="h-8 w-20 rounded-md" />
        </CardHeader>
        <CardContent>
          {/* blade text block */}
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>

      <Link
        href="/chat"
        className="text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Forge your own prompt →
      </Link>
    </div>
  );
}
