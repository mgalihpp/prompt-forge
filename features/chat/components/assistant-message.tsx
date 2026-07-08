import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";

// The assistant reply is the product of this app (an enhanced prompt), so it
// gets a distinct surface, rich markdown, and a collapsible reasoning trail.
// Take-away actions (copy/export/save/diff) live in the ForgeActions bar
// rendered by AssistantTurn, so this component no longer carries its own.
export const AssistantMessage = memo(
  function AssistantMessage({
    text,
    reasoning,
    streaming,
  }: {
    text: string;
    reasoning?: string;
    streaming?: boolean;
  }) {
    return (
      <div className="group/assistant flex w-full min-w-0 flex-col gap-1.5">
        <div className="min-w-0 rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-card-foreground shadow-sm">
          {reasoning && <Reasoning text={reasoning} />}

          {text ? (
            <Markdown>{text}</Markdown>
          ) : (
            streaming && (
              <span className="inline-block h-4 w-2 animate-pulse rounded-sm bg-muted-foreground/50 align-middle" />
            )
          )}
        </div>
      </div>
    );
  },
  (prev, next) => {
    if (prev.text !== next.text) return false;
    if (prev.reasoning !== next.reasoning) return false;
    if (prev.streaming !== next.streaming) return false;
    return true;
  },
);

// Collapsed by default: the enhanced prompt is the headline, the model's
// reasoning is supporting detail one click away.
function Reasoning({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2.5 border-b border-dashed pb-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronRight
          className={cn("size-3.5 transition-transform", open && "rotate-90")}
        />
        Reasoning
      </button>
      {open && (
        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  );
}
