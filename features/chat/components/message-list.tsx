import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { Button } from "@/components/ui/button"
import { useChat } from "@ai-sdk/react"
import { Sparkles, RotateCcw } from "lucide-react"
import { CHAT_ID } from "../constants"

// Shares the same useChat instance as the Composer via CHAT_ID.
export function MessageList() {
  const { messages, status, error, regenerate } = useChat({ id: CHAT_ID })

  // "submitted" = request sent, no tokens yet → show typing bubble.
  const waiting = status === "submitted"

  return (
    <MessageScrollerProvider>
      <MessageScroller className="flex-1">
        <MessageScrollerViewport className="px-4">
          <MessageScrollerContent className="py-6">
            {messages.length === 0 && !waiting && (
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
              const reasoning = m.parts
                .map((p) => (p.type === "reasoning" ? p.text : ""))
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
                      <MessageContent className="pt-1 leading-relaxed">
                        {reasoning && (
                          <details className="mb-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                            <summary className="cursor-pointer select-none font-medium">
                              Reasoning
                            </summary>
                            <p className="mt-1.5 whitespace-pre-wrap">
                              {reasoning}
                            </p>
                          </details>
                        )}
                        <span className="whitespace-pre-wrap">{text}</span>
                      </MessageContent>
                    </Message>
                  )}
                </MessageScrollerItem>
              )
            })}

            {waiting && (
              <MessageScrollerItem>
                <Message align="start">
                  <MessageAvatar className="size-8">
                    <Sparkles className="size-4" />
                  </MessageAvatar>
                  <MessageContent className="pt-2">
                    <span className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" />
                    </span>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            )}

            {error && (
              <MessageScrollerItem>
                <div className="mx-auto flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <span>Something went wrong.</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1.5 text-destructive hover:text-destructive"
                    onClick={() => regenerate()}
                  >
                    <RotateCcw className="size-3.5" />
                    Retry
                  </Button>
                </div>
              </MessageScrollerItem>
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
