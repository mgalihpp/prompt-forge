import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <div>
      <div className="mx-auto flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        <span>Something went wrong.</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1.5 text-destructive hover:text-destructive"
          onClick={onRetry}
        >
          <RotateCcw className="size-3.5" />
          Retry
        </Button>
      </div>
    </div>
  );
}
