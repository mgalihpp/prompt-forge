import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder that mirrors ForgeCard's layout 1:1. */
export function ForgeCardSkeleton() {
  return (
    <Card size="sm" className="relative flex flex-col gap-3">
      {/* favorite star */}
      <Skeleton className="absolute top-2 right-2 size-7 rounded-full" />
      <CardHeader>
        <div className="min-w-0 space-y-1.5 pe-8">
          {/* title */}
          <Skeleton className="h-4 w-3/5" />
          {/* relative date */}
          <Skeleton className="h-3 w-24" />
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* line-clamp-3 blade preview */}
        <Skeleton className="h-20 w-full rounded-lg" />
      </CardContent>

      <CardFooter className="items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap gap-1">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
