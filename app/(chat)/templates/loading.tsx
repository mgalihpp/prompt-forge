import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES, CURATED_TEMPLATES } from "@/features/templates/curated";
import { TemplateCardSkeleton } from "@/features/templates/template-card-skeleton";

/** Shown while templates/page.tsx awaits the server prefetch of template.list. */
export default function TemplatesLoading() {
  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Static header — identical to page.tsx so content doesn't shift */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Templates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready-made starting points. Pick one to prefill the composer, or save
          your own.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {/* My templates — mirrors the MyTemplates section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              My templates
            </h2>
            {/* CreateTemplateDialog trigger */}
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["a", "b"].map((k) => (
              <TemplateCardSkeleton key={k} />
            ))}
          </div>
        </section>

        {/* Curated gallery — real category labels, one skeleton per template */}
        <section className="flex flex-col gap-6">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {CURATED_TEMPLATES.filter((t) => t.category === category).map(
                  (t) => (
                    <TemplateCardSkeleton key={t.id} />
                  ),
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
