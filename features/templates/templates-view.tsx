"use client";

import { LayoutTemplate } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplates } from "@/lib/hooks/use-templates";
import { CreateTemplateDialog } from "./create-template-dialog";
import { CATEGORIES, CURATED_TEMPLATES } from "./curated";
import { TemplateCard } from "./template-card";

function MyTemplates() {
  const { data: templates, isLoading, error } = useTemplates();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          My templates
        </h2>
        <CreateTemplateDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {["a", "b"].map((k) => (
            <Skeleton key={k} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Empty className="border py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutTemplate />
            </EmptyMedia>
            <EmptyTitle>Couldn't load your templates</EmptyTitle>
            <EmptyDescription>Make sure you're signed in.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : !templates?.length ? (
        <Empty className="border py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutTemplate />
            </EmptyMedia>
            <EmptyTitle>No custom templates yet</EmptyTitle>
            <EmptyDescription>
              Save a prompt + knob setup you use often and reuse it in one
              click.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              label={t.label}
              emoji={t.emoji}
              ore={t.ore}
              opts={(t.opts ?? {}) as Record<string, string>}
              deepForge={t.deepForge}
              deletableId={t.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CuratedGallery() {
  return (
    <section className="flex flex-col gap-6">
      {CATEGORIES.map((category) => (
        <div key={category} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            {category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CURATED_TEMPLATES.filter((t) => t.category === category).map(
              (t) => (
                <TemplateCard
                  key={t.id}
                  label={t.label}
                  emoji={t.emoji}
                  ore={t.ore}
                  opts={t.opts}
                  deepForge={t.deepForge}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export function TemplatesView() {
  const filter = useSearchParams().get("filter");

  return (
    <div className="flex flex-col gap-10">
      {filter !== "curated" && <MyTemplates />}
      {filter !== "mine" && <CuratedGallery />}
    </div>
  );
}
