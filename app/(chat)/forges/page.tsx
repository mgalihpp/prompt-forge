import { Suspense } from "react";
import { ForgesView } from "@/features/forges/forges-view";

export default function ForgesPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          My Forges
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your saved prompts. Favorite, copy, share, or delete.
        </p>
      </div>
      <Suspense>
        <ForgesView />
      </Suspense>
    </div>
  );
}
