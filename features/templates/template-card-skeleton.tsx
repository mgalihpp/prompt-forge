import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder that mirrors TemplateCard's layout 1:1. */
export function TemplateCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
      <div className="flex min-w-0 items-center gap-2.5 pe-8">
        {/* emoji */}
        <Skeleton className="size-7 rounded-full" />
        {/* label */}
        <Skeleton className="h-4 w-2/5" />
      </div>

      {/* line-clamp-2 ore preview */}
      <div className="flex-1 space-y-1.5 py-0.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>

      <div className="mt-1 flex items-center gap-1">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
    </div>
  );
}
