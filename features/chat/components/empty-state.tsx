import { ForgyMascot } from "./forgy-mascot";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <ForgyMascot state="idle" className="size-24" autoWave />
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        Enhance your prompt
      </p>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        Type a rough idea below. Prompt Forge will turn it into a clearer, more
        useful prompt.
      </p>
    </div>
  );
}
