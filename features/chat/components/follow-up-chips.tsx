"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSendText } from "../send";

/**
 * Follow-up suggestion chips under the last Deep Forge result. Clicking one
 * sends it immediately as the next user message (the model treats it as a
 * REFINEMENT of the forged prompt).
 */
export function FollowUpChips({ suggestions }: { suggestions: string[] }) {
  const sendText = useSendText();

  if (!suggestions.length) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <Sparkles className="size-3.5 text-muted-foreground" />
      {suggestions.map((s) => (
        <Button
          key={s}
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-full px-3 text-xs font-normal text-muted-foreground hover:text-foreground"
          onClick={() => sendText(s)}
        >
          {s}
        </Button>
      ))}
    </div>
  );
}
