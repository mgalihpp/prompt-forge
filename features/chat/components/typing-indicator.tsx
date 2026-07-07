import { Message, MessageContent } from "@/components/ui/message";
import { ForgyMascot } from "./forgy-mascot";

export function TypingIndicator() {
  return (
    <div>
      <Message align="start" className="max-w-[min(52rem,100%)]">
        <MessageContent className="w-fit rounded-2xl rounded-tl-md border bg-muted/45 px-4 py-3 shadow-sm">
          <span className="flex gap-1.5">
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" />
          </span>
        </MessageContent>
      </Message>
      <ForgyMascot state="thinking" className="mt-4 size-12" />
    </div>
  );
}
