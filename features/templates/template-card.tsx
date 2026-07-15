"use client";

import { ArrowRight, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteTemplate } from "@/lib/hooks/use-templates";
import { useApplyTemplate } from "./use-apply-template";

type TemplateCardProps = {
  label: string;
  emoji: string;
  ore: string;
  opts: Record<string, string>;
  deepForge?: boolean;
  /** Set for custom templates — enables the delete action. */
  deletableId?: string;
};

export function TemplateCard({
  label,
  emoji,
  ore,
  opts,
  deepForge,
  deletableId,
}: TemplateCardProps) {
  const apply = useApplyTemplate();
  const del = useDeleteTemplate();

  return (
    // The apply action is a stretched <button> overlay — it can't wrap the
    // tile because the delete action is a <button> too (no nested buttons).
    <div className="group/template relative flex flex-col gap-2 rounded-xl border bg-card p-4 text-left text-sm transition-colors hover:border-foreground/20 hover:bg-accent/50 has-[button[data-apply]:focus-visible]:ring-[3px] has-[button[data-apply]:focus-visible]:ring-ring/50">
      <button
        type="button"
        data-apply
        aria-label={`Use template: ${label}`}
        className="absolute inset-0 cursor-pointer rounded-xl outline-none"
        onClick={() => apply({ ore, opts, deepForge })}
      />

      {deletableId && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 size-7 rounded-full text-muted-foreground opacity-60 transition-opacity hover:text-destructive hover:opacity-100"
                disabled={del.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  del.mutate(
                    { id: deletableId },
                    {
                      onSuccess: () => toast.success("Template deleted"),
                      onError: () => toast.error("Couldn't delete template"),
                    },
                  );
                }}
              />
            }
          >
            <Trash2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      )}

      <div className="flex min-w-0 items-center gap-2.5 pe-8">
        <span className="text-xl" aria-hidden>
          {emoji}
        </span>
        <p className="truncate font-medium">{label}</p>
      </div>

      <p className="line-clamp-2 flex-1 text-sm whitespace-pre-wrap text-muted-foreground">
        {ore}
      </p>

      <div className="mt-1 flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap gap-1">
          {opts.mode && <Badge variant="secondary">{opts.mode}</Badge>}
          {opts.target && opts.target !== "Generic" && (
            <Badge variant="outline">{opts.target}</Badge>
          )}
          {deepForge && (
            <Badge variant="outline">
              <Sparkles /> Deep
            </Badge>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity duration-200 group-hover/template:opacity-100">
          Use <ArrowRight className="size-3" />
        </span>
      </div>
    </div>
  );
}
