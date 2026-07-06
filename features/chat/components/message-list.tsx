import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { useChat } from "@ai-sdk/react"
import { Sparkles } from "lucide-react"
import { CHAT_ID } from "../constants"

// Shares the same useChat instance as the Composer via CHAT_ID.
export function MessageList() {
  const { messages } = useChat({ id: CHAT_ID })
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

            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("")
              return (
                <MessageScrollerItem key={m.id}>
                  {m.role === "user" ? (
                    <Message align="end">
                      <MessageContent>
                        <div className="w-fit rounded-2xl bg-muted px-4 py-2.5">
                          {text}
                        </div>
                      </MessageContent>
                    </Message>
                  ) : (
                    <Message align="start">
                      <MessageAvatar className="size-8">
                        <Sparkles className="size-4" />
                      </MessageAvatar>
                      <MessageContent className="pt-1 leading-relaxed whitespace-pre-wrap">
                        {text}
                      </MessageContent>
                    </Message>
                  )}
                </MessageScrollerItem>
              )
            })}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
