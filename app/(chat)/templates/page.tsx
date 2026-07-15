import { Suspense } from "react";
import { TemplatesView } from "@/features/templates/templates-view";

export default function TemplatesPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Templates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready-made starting points. Pick one to prefill the composer, or save
          your own.
        </p>
      </div>
      <Suspense>
        <TemplatesView />
      </Suspense>
    </div>
  );
}
