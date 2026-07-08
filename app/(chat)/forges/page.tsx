import { ForgesView } from "@/features/forges/forges-view";

export default function ForgesPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">My Forges</h1>
        <p className="text-sm text-muted-foreground">
          Your saved prompts. Favorite, copy, share, or delete.
        </p>
      </div>
      <ForgesView />
    </div>
  );
}
