import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUp, SlidersHorizontal, Hammer, Square } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { OPTIONS } from "../constants"
import { chat } from "../chat-instance"
import { useChatStore } from "../store"

export function Composer() {
  // Primitive/action selectors: each returns a stable ref, so subscribing
  // here doesn't drag the message list into re-rendering on keystrokes.
  const input = useChatStore((s) => s.input)
  const opts = useChatStore((s) => s.opts)
  const deepForge = useChatStore((s) => s.deepForge)
  const setInput = useChatStore((s) => s.setInput)
  const setOption = useChatStore((s) => s.setOption)
  const toggleDeepForge = useChatStore((s) => s.toggleDeepForge)

  const { sendMessage, stop, status } = useChat({ chat })
  const busy = status === "submitted" || status === "streaming"

  const send = () => {
    const text = input.trim()
    if (!text || busy) return
    // opts + deepForge ride along as request body → read by /api/chat
    sendMessage({ text }, { body: { opts, deepForge } })
    setInput("")
  }

  return (
    <div className="shrink-0 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto w-full max-w-4xl pb-4">
        <div className="flex flex-col gap-2 rounded-3xl border bg-background p-2 shadow-lg shadow-muted/40 focus-within:ring-1 focus-within:ring-ring">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Drop a rough prompt and I'll forge it into something sharper…"
            className="max-h-40 min-h-10 resize-none border-none bg-transparent px-3 py-2 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center gap-1.5 px-1 pb-1">
          <DropdownMenu>
            <Tooltip>
              <DropdownMenuTrigger
                render={
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full"
                      />
                    }
                  />
                }
              >
                <SlidersHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <TooltipContent>Options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="w-56 p-1.5">
              {Object.entries(OPTIONS).map(([key, { icon: Icon, values }]) => (
                <DropdownMenuSub key={key}>
                  <DropdownMenuSubTrigger className="gap-2 rounded-md py-2 text-xs">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="capitalize">{key}</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
                      {opts[key]}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="p-1.5">
                    <DropdownMenuRadioGroup
                      value={opts[key]}
                      onValueChange={(v) => setOption(key, v)}
                    >
                      {values.map((v) => (
                        <DropdownMenuRadioItem
                          key={v}
                          value={v}
                          className="rounded-md text-xs"
                        >
                          {v}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant={deepForge ? "default" : "ghost"}
                  size={deepForge ? "sm" : "icon"}
                  className={
                    deepForge
                      ? "h-8 gap-1.5 rounded-full text-xs"
                      : "size-8 rounded-full"
                  }
                  onClick={toggleDeepForge}
                />
              }
            >
              <Hammer className="size-4" />
              {deepForge && "ON"}
            </TooltipTrigger>
            <TooltipContent>Deep Forge</TooltipContent>
          </Tooltip>

          {busy ? (
            <Button
              size="icon"
              variant="secondary"
              className="ml-auto size-8 shrink-0 rounded-full"
              onClick={stop}
            >
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="ml-auto size-8 shrink-0 rounded-full"
              disabled={!input.trim()}
              onClick={send}
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
