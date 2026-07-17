import { RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DEEP_FORGE_PRO_MESSAGE,
  LIMIT_MESSAGE,
  PRO_MODEL_MESSAGE,
} from "@/lib/plans";
import { ForgyMascot } from "./forgy-mascot";

// Pro-gate rejections the chat route returns as the response body. The AI SDK
// surfaces the body as the error message, so we string-match to show an
// upgrade prompt instead of a generic error + retry.
const PRO_MESSAGES = [DEEP_FORGE_PRO_MESSAGE, PRO_MODEL_MESSAGE];

export function ErrorNotice({
  error,
  onRetry,
}: {
  error?: Error;
  onRetry: () => void;
}) {
  const message = error?.message ?? "";
  // Retrying can't help for the daily-limit 429 or the pro gates.
  const limitHit = message.includes(LIMIT_MESSAGE);
  const proHit = PRO_MESSAGES.find((m) => message.includes(m));
  const noRetry = limitHit || Boolean(proHit);

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        <span>
          {proHit ?? (limitHit ? LIMIT_MESSAGE : "Something went wrong.")}
        </span>
        {proHit ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5 text-destructive hover:text-destructive"
            nativeButton={false}
            render={<Link href="/settings/billing" />}
          >
            <Sparkles className="size-3.5" />
            Upgrade
          </Button>
        ) : (
          !noRetry && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-destructive hover:text-destructive"
              onClick={onRetry}
            >
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          )
        )}
      </div>
      <ForgyMascot state="error" className="my-4 size-12" />
    </div>
  );
}
