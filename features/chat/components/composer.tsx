import { ArrowUp, Hammer, SlidersHorizontal, Square } from "lucide-react";
import { memo, useCallback, useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { chat } from "../chat-instance";
import { OPTIONS } from "../constants";
import { useChatStore } from "../store";

function useChatStatus() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsub = (chat as any)["~registerStatusCallback"](onStoreChange);
      return unsub;
    },
    () => chat.status,
    () => "ready" as const,
  );
}

const ChatInput = memo(function ChatInput({ onSend }: { onSend: () => void }) {
  const input = useChatStore((s) => s.input);
  const setInput = useChatStore((s) => s.setInput);

  return (
    <Textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSend();
        }
      }}
      placeholder="Drop a rough prompt and I'll forge it into something sharper…"
      className="max-h-40 min-h-10 resize-none border-none bg-transparent px-3 py-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
    />
  );
});

export function Composer() {
  const opts = useChatStore((s) => s.opts);
  const deepForge = useChatStore((s) => s.deepForge);
  const hasInput = useChatStore((s) => s.input.trim().length > 0);
  const setOption = useChatStore((s) => s.setOption);
  const toggleDeepForge = useChatStore((s) => s.toggleDeepForge);

  const status = useChatStatus();
  const busy = status === "submitted" || status === "streaming";
  const busyRef = useRef(false);
  busyRef.current = busy;

  const send = useCallback(() => {
    const { input, opts, deepForge } = useChatStore.getState();
    const text = input.trim();
    if (!text || busyRef.current) return;
    chat.sendMessage({ text }, { body: { opts, deepForge } });
    useChatStore.setState({ input: "" });
  }, []);

  return (
    <div className="shrink-0 bg-background/80 rounded-t-3xl backdrop-blur-xl">
      <div className="pb-4">
        <div className="flex flex-col gap-2 rounded-3xl border bg-background p-2 shadow-lg shadow-muted/40 focus-within:ring-1 focus-within:ring-ring">
          <ChatInput onSend={send} />

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
                {Object.entries(OPTIONS).map(
                  ([key, { icon: Icon, values }]) => (
                    <DropdownMenuSub key={key}>
                      <DropdownMenuSubTrigger className="gap-2 rounded-md py-2 text-xs [&>svg:last-child]:!ml-1">
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="capitalize">{key}</span>
                        <span className="ml-auto font-medium text-muted-foreground">
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
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant={deepForge ? "glossy" : "ghost"}
                    size={deepForge ? "sm" : "icon"}
                    className={cn(
                      "transition-[background-color,box-shadow,color,filter] duration-200 ease-out",
                      deepForge
                        ? "h-8 gap-1.5 rounded-full text-xs"
                        : "size-8 rounded-full",
                    )}
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
                variant="glossy"
                className="ml-auto size-8 shrink-0 rounded-full"
                onClick={() => chat.stop()}
              >
                <Square className="size-3.5 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="glossy"
                className="ml-auto size-8 shrink-0 rounded-full"
                disabled={!hasInput}
                onClick={send}
              >
                <ArrowUp className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
