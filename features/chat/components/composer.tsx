import { useQuery } from "@tanstack/react-query";
import { ArrowUp, Hammer, SlidersHorizontal, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
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
import { useCreateThread } from "@/lib/hooks/use-history";
import { useIsPro } from "@/lib/hooks/use-plan";
import { orpc } from "@/lib/orpc/client";
import { cn } from "@/lib/utils";
import { chat } from "../chat-instance";
import { OPTIONS } from "../constants";
import { useSendText } from "../send";
import { useChatStore } from "../store";
import { useUpgradeDialog } from "../upgrade-dialog-store";
import { ModelSelector } from "./model-selector";
import { UpgradeDialog } from "./upgrade-dialog";

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
  const isPro = useIsPro();
  const router = useRouter();
  const openUpgrade = useUpgradeDialog((s) => s.setOpen);
  const { data: usage } = useQuery(orpc.user.usage.queryOptions());

  // Free users at their daily cap: `limit` is a number, `used >= limit`.
  const outOfPrompts =
    !isPro && usage != null && usage.limit != null && usage.used >= usage.limit;

  // Deep Forge is Pro-only. Force a persisted `true` off for free users so a
  // stale toggle can't send (the server 403 is the backstop).
  useEffect(() => {
    if (!isPro && useChatStore.getState().deepForge) {
      useChatStore.setState({ deepForge: false });
    }
  }, [isPro]);

  const status = useChatStatus();
  const { isPending: creatingThread } = useCreateThread();
  const busy =
    status === "submitted" || status === "streaming" || creatingThread;
  const busyRef = useRef(false);
  busyRef.current = busy;
  const outOfPromptsRef = useRef(outOfPrompts);
  outOfPromptsRef.current = outOfPrompts;

  // useSendText is referentially stable, so `send` stays stable for ChatInput
  const sendText = useSendText();

  const send = useCallback(async () => {
    const { input } = useChatStore.getState();
    const text = input.trim();
    if (!text || busyRef.current) return;

    // Free user out of quota: open the upgrade dialog instead of a doomed
    // request. The server 429 is the backstop if this check is ever stale.
    if (outOfPromptsRef.current) {
      openUpgrade(true);
      return;
    }

    await sendText(text);
    useChatStore.setState({ input: "" });
  }, [sendText, openUpgrade]);

  return (
    <div className="shrink-0 bg-background/80 rounded-t-3xl backdrop-blur-xl">
      <div className="pb-4">
        <div className="flex flex-col gap-2 rounded-3xl border bg-background p-2 shadow-lg shadow-muted/40 focus-within:ring-1 focus-within:ring-ring">
          <ChatInput onSend={send} />

          <div className="flex items-center gap-1.5 px-1 pb-1">
            <ModelSelector />

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
                    size={deepForge || !isPro ? "sm" : "icon"}
                    className={cn(
                      "transition-[background-color,box-shadow,color,filter] duration-200 ease-out",
                      deepForge || !isPro
                        ? "h-8 gap-1.5 rounded-full text-xs"
                        : "size-8 rounded-full",
                    )}
                    onClick={
                      isPro
                        ? toggleDeepForge
                        : () => router.push("/settings/billing")
                    }
                  />
                }
              >
                <Hammer className="size-4" />
                {deepForge && "ON"}
                {!isPro && (
                  <span className="rounded bg-primary/15 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                    Pro
                  </span>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {isPro ? "Deep Forge" : "Deep Forge — a Pro feature"}
              </TooltipContent>
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
      <UpgradeDialog />
    </div>
  );
}
