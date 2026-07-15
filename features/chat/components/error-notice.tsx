import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIMIT_MESSAGE } from "@/lib/plans";
import { ForgyMascot } from "./forgy-mascot";

export function ErrorNotice({
  error,
  onRetry,
}: {
  error?: Error;
  onRetry: () => void;
}) {
  // The chat route returns 429 with LIMIT_MESSAGE as the body; the AI SDK
  // surfaces that body as the error message. Retrying can't help there.
  const limitHit = error?.message.includes(LIMIT_MESSAGE) ?? false;

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        <span>{limitHit ? LIMIT_MESSAGE : "Something went wrong."}</span>
        {!limitHit && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5 text-destructive hover:text-destructive"
            onClick={onRetry}
          >
            <RotateCcw className="size-3.5" />
            Retry
          </Button>
        )}
      </div>
      <ForgyMascot state="error" className="my-4 size-12" />
    </div>
  );
}
