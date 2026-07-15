"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
    <Card
      size="sm"
      className="group/template relative flex cursor-pointer flex-col gap-3 transition-shadow hover:shadow-md"
      onClick={() => apply({ ore, opts, deepForge })}
    >
      {deletableId && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 size-7 rounded-full text-muted-foreground opacity-60 transition-opacity hover:text-destructive hover:opacity-100"
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

      <CardHeader>
        <div className="flex min-w-0 items-center gap-2 pe-8">
          <span className="text-lg" aria-hidden>
            {emoji}
          </span>
          <p className="truncate font-medium">{label}</p>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-3 rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap text-muted-foreground">
          {ore}
        </p>
      </CardContent>

      <CardFooter>
        <div className="flex min-w-0 flex-wrap gap-1">
          {opts.mode && <Badge variant="secondary">{opts.mode}</Badge>}
          {opts.target && opts.target !== "Generic" && (
            <Badge variant="outline">{opts.target}</Badge>
          )}
          {deepForge && <Badge variant="outline">Deep</Badge>}
        </div>
      </CardFooter>
    </Card>
  );
}
