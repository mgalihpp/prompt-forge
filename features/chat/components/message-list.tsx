import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { Sparkles } from "lucide-react"
import { useChatStore } from "../store"

export function MessageList() {
  // Only re-renders when the messages array changes — not on every keystroke.
  const messages = useChatStore((s) => s.messages)
  return (
    <MessageScrollerProvider>
      <MessageScroller className="flex-1">
        <MessageScrollerViewport className="px-4">
          <MessageScrollerContent className="py-6">
            {messages.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <Sparkles className="size-8" />
                <p className="text-lg font-medium text-foreground">
                  Enhance your prompt
                </p>
                <p className="text-sm">Type a prompt below to get started.</p>
              </div>
            )}

            {messages.map((m) => (
              <MessageScrollerItem key={m.id}>
                {m.role === "user" ? (
                  <Message align="end">
                    <MessageContent>
                      <div className="w-fit rounded-2xl bg-muted px-4 py-2.5">
                        {m.text}
                      </div>
                    </MessageContent>
                  </Message>
                ) : (
                  <Message align="start">
                    <MessageAvatar className="size-8">
                      <Sparkles className="size-4" />
                    </MessageAvatar>
                    <MessageContent className="pt-1 leading-relaxed">
                      {m.text}
                    </MessageContent>
                  </Message>
                )}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
