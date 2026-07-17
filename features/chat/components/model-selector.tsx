"use client";

import { Check, Cpu, Loader2, Lock, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModels } from "@/lib/hooks/use-models";
import { useIsPro } from "@/lib/hooks/use-plan";
import type { ChatModel } from "@/lib/models";
import { cn } from "@/lib/utils";
import { useChatStore } from "../store";
import { ProviderIcon } from "./provider-icon";

// Short, human label for a model — OpenRouter names are "Vendor: Model (free)";
// drop the vendor prefix and the trailing "(free)" for a tidy trigger/row.
function shortName(m: ChatModel): string {
  return m.name
    .replace(/^[^:]+:\s*/, "")
    .replace(/\s*\(free\)\s*$/i, "")
    .trim();
}

const ProviderRail = memo(function ProviderRail({
  providers,
  active,
  onSelect,
}: {
  providers: string[];
  active: string | null;
  onSelect: (p: string | null) => void;
}) {
  return (
    <div
      className="flex w-12 shrink-0 flex-col items-center gap-2 overflow-y-auto border-r py-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent"
      role="tablist"
      aria-label="Filter models by provider"
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              role="tab"
              aria-selected={active === null}
              aria-label="All providers"
              onClick={() => onSelect(null)}
              className={cn(
                "flex p-1.5 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                active === null && "bg-accent text-accent-foreground",
              )}
            />
          }
        >
          <Cpu className="size-4.5" />
        </TooltipTrigger>
        <TooltipContent side="right">All providers</TooltipContent>
      </Tooltip>
      {providers.map((p) => (
        <Tooltip key={p}>
          <TooltipTrigger
            render={
              <button
                type="button"
                role="tab"
                aria-selected={active === p}
                aria-label={p}
                onClick={() => onSelect(active === p ? null : p)}
                className={cn(
                  "flex p-1.5 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  active === p && "bg-accent text-accent-foreground",
                )}
              />
            }
          >
            <ProviderIcon provider={p} className="size-5" />
          </TooltipTrigger>
          <TooltipContent side="right" className="capitalize">
            {p}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
});

const ModelRow = memo(function ModelRow({
  model,
  selected,
  locked,
  onSelect,
}: {
  model: ChatModel;
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      aria-disabled={locked || undefined}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none",
        selected && "bg-accent/60",
        locked && "opacity-60",
      )}
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted p-1.5">
        <ProviderIcon provider={model.provider} className="size-full" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-medium text-sm text-foreground">
            {shortName(model)}
          </span>
          {model.tier === "pro" ? (
            <span className="shrink-0 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Pro
            </span>
          ) : (
            <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
              Free
            </span>
          )}
          {locked && <Lock className="size-3 shrink-0 text-muted-foreground" />}
        </span>
        {model.description && (
          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
            {model.description}
          </span>
        )}
      </span>
      {selected && <Check className="mt-1.5 size-4 shrink-0 text-foreground" />}
    </button>
  );
});

export function ModelSelector() {
  const model = useChatStore((s) => s.model);
  const setModel = useChatStore((s) => s.setModel);
  const isPro = useIsPro();
  const router = useRouter();

  const { data: models, isLoading, isError } = useModels();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const list = useMemo(() => models ?? [], [models]);

  // A persisted pro selection from a lapsed subscription: fall back to the
  // default model. The server 403 is the real gate; this keeps the UI honest.
  const storedSelection = list.find((m) => m.id === model) ?? null;
  useEffect(() => {
    if (!isPro && storedSelection?.tier === "pro") setModel(null);
  }, [isPro, storedSelection, setModel]);

  const providers = useMemo(
    () => Array.from(new Set(list.map((m) => m.provider))).sort(),
    [list],
  );

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return list.filter((m) => {
      if (provider && m.provider !== provider) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    });
  }, [list, provider, deferredQuery]);

  const selected = list.find((m) => m.id === model) ?? null;
  const triggerLabel = selected
    ? shortName(selected)
    : model
      ? "Custom model"
      : "Default model";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`Model: ${triggerLabel}. Click to change.`}
                  className="h-8 gap-1.5 rounded-full border px-3 text-xs font-medium text-muted-foreground"
                />
              }
            />
          }
        >
          {selected ? (
            <ProviderIcon provider={selected.provider} className="size-4" />
          ) : (
            <Cpu className="size-4" />
          )}
          <span className="max-w-40 truncate">{triggerLabel}</span>
        </PopoverTrigger>
        <TooltipContent>Model</TooltipContent>
      </Tooltip>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[28rem] max-w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0"
        aria-label="Select a model"
      >
        <div className="relative border-b p-2">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 size-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models…"
            aria-label="Search models"
            className="h-10 border-none bg-transparent pl-8 text-sm focus-visible:ring-0 dark:bg-transparent"
          />
        </div>

        <div className="flex h-[26rem] max-h-[60vh]">
          {providers.length > 1 && (
            <ProviderRail
              providers={providers}
              active={provider}
              onSelect={setProvider}
            />
          )}

          <div
            role="listbox"
            aria-label="Models"
            className="flex-1 space-y-0.5 overflow-y-auto p-1.5"
          >
            {model && (
              <button
                type="button"
                onClick={() => {
                  setModel(null);
                  setOpen(false);
                }}
                className="mb-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Cpu className="size-3.5" />
                </span>
                Use the default model
              </button>
            )}

            {isLoading && (
              <div className="flex h-full items-center justify-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="size-4 animate-spin" />
                Loading models…
              </div>
            )}

            {isError && !isLoading && (
              <div className="flex h-full items-center justify-center px-4 text-center text-muted-foreground text-sm">
                Couldn't load models. Using the default.
              </div>
            )}

            {!isLoading &&
              !isError &&
              filtered.length === 0 &&
              list.length > 0 && (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No models match "{deferredQuery}".
                </div>
              )}

            {filtered.map((m) => {
              const locked = m.tier === "pro" && !isPro;
              return (
                <ModelRow
                  key={m.id}
                  model={m}
                  selected={m.id === model}
                  locked={locked}
                  onSelect={() => {
                    if (locked) {
                      setOpen(false);
                      router.push("/settings/billing");
                      return;
                    }
                    setModel(m.id);
                    setOpen(false);
                  }}
                />
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
