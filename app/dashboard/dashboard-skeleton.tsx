import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder that mirrors dashboard/page.tsx 1:1 — static chrome is
 * rendered for real, only the data-dependent parts pulse.
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {/* UserButton avatar */}
          <Skeleton className="size-8 rounded-full" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome block */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Projects</h3>
          <div className="space-y-6">
            {/* New-project form */}
            <div className="flex gap-2">
              <Skeleton className="h-[42px] flex-1 rounded-lg" />
              <Skeleton className="h-[42px] w-20 rounded-lg" />
            </div>
            {/* Project cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["a", "b", "c"].map((k) => (
                <div
                  key={k}
                  className="p-6 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800"
                >
                  <Skeleton className="mb-2 h-5 w-2/5" />
                  <Skeleton className="mb-4 h-4 w-4/5" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-14 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
