import { memo } from "react";
import { Message, MessageContent } from "@/components/ui/message";

export const UserBubble = memo(function UserBubble({ text }: { text: string }) {
  return (
    <Message align="end">
      <MessageContent className="items-end">
        <div className="w-fit max-w-[min(42rem,100%)] rounded-2xl rounded-tr-md border bg-background px-4 py-3 text-foreground shadow-sm">
          {text}
        </div>
      </MessageContent>
    </Message>
  );
});
