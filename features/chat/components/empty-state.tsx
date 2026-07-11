"use client";

import { PRESETS } from "../presets";
import { useChatStore } from "../store";
import { ForgyMascot } from "./forgy-mascot";

export function EmptyState() {
  const applyPreset = useChatStore((s) => s.applyPreset);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <ForgyMascot state="idle" className="size-24" autoWave />
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        Enhance your prompt
      </p>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        Type a rough idea below, or start from a template. Prompt Forge will
        turn it into a clearer, more useful prompt.
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p)}
            className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-accent hover:text-foreground"
          >
            <span aria-hidden>{p.emoji}</span>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
