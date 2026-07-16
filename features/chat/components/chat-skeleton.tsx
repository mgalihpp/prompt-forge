import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors Composer's rounded input card: textarea + options/deep-forge/send row. */
export function ComposerSkeleton() {
  return (
    <div className="shrink-0 bg-background/80 rounded-t-3xl backdrop-blur-xl">
      <div className="pb-4">
        <div className="flex flex-col gap-2 rounded-3xl border bg-background p-2 shadow-lg shadow-muted/40">
          {/* textarea placeholder line */}
          <div className="min-h-10 px-3 py-2">
            <Skeleton className="h-5 w-3/5 max-w-96" />
          </div>
          <div className="flex items-center gap-1.5 px-1 pb-1">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="ml-auto size-8 shrink-0 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mirrors Chat's empty state: centered mascot + copy + composer. */
export function ChatPageSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_34rem)] px-4 sm:px-6">
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Forgy mascot */}
          <Skeleton className="size-24 rounded-full" />
          {/* "Enhance your prompt" */}
          <Skeleton className="h-7 w-56" />
          {/* helper copy */}
          <div className="flex w-full flex-col items-center gap-1.5">
            <Skeleton className="h-4 w-96 max-w-full" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          {/* "Browse templates" pill */}
          <Skeleton className="mt-2 h-8 w-40 rounded-full" />
        </div>
        <ComposerSkeleton />
      </div>
    </div>
  );
}

/** Mirrors Chat's conversation view: alternating turns + sticky composer. */
export function ThreadSkeleton() {
  return (
    <div className="flex h-full w-full flex-col bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_34rem)]">
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex flex-col py-8">
          <div className="flex w-full flex-col gap-5">
            {/* user bubble (right) */}
            <div className="flex justify-end">
              <Skeleton className="h-12 w-3/5 rounded-2xl rounded-tr-md" />
            </div>
            {/* assistant turn: prose + forge result card */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="mt-1 h-40 w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            {/* user bubble (right) */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-2/5 rounded-2xl rounded-tr-md" />
            </div>
            {/* assistant turn */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="mt-1 h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 mt-auto">
          <ComposerSkeleton />
        </div>
      </div>
    </div>
  );
}
