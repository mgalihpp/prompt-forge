import { ForgeCardSkeleton } from "@/features/forges/forge-card-skeleton";

/** Shown while forges/page.tsx awaits the server prefetch of forge.list. */
export default function ForgesLoading() {
  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Static header — identical to page.tsx so content doesn't shift */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          My Forges
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your saved prompts. Favorite, copy, share, or delete.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {["a", "b", "c", "d"].map((k) => (
          <ForgeCardSkeleton key={k} />
        ))}
      </div>
    </div>
  );
}
