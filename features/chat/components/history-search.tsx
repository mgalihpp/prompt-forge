"use client";

import { format } from "date-fns";
import { MessageSquare, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useSearchHistory, useThreads } from "@/lib/hooks/use-history";
import { openThread } from "../open-thread";

export function HistorySearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { data: threads } = useThreads();
  const { data: hits, isFetching } = useSearchHistory(q);

  const searching = q.trim().length >= 2;

  // ⌘K / Ctrl+K opens the palette, same convention as every command dialog.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const select = (threadId: string) => {
    setOpen(false);
    setQ("");
    openThread(threadId).catch(() => toast.error("Couldn't load conversation"));
  };

  return (
    <>
      <SidebarMenuButton tooltip="Search" onClick={() => setOpen(true)}>
        <Search /> <span>Search</span>
      </SidebarMenuButton>

      <CommandDialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQ("");
        }}
        title="Search chat history"
        description="Search your past conversations"
      >
        {/* Results come from the server — disable cmdk's own filtering */}
        <Command shouldFilter={false}>
          <CommandInput
            value={q}
            onValueChange={setQ}
            placeholder="Search chat history…"
          />
          <CommandList>
            {searching ? (
              // Server-side message search (1 keystroke short still shows recents)
              isFetching && !hits ? (
                <div className="flex justify-center py-6">
                  <Spinner className="size-4" />
                </div>
              ) : (
                <>
                  <CommandEmpty>No messages match “{q.trim()}”.</CommandEmpty>
                  {hits && hits.length > 0 && (
                    <CommandGroup
                      heading={`${hits.length} result${hits.length === 1 ? "" : "s"}`}
                    >
                      {hits.map((m) => (
                        <CommandItem
                          key={m.id}
                          value={m.id}
                          onSelect={() => select(m.thread.id)}
                        >
                          <MessageSquare className="text-muted-foreground" />
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">
                              {m.thread.title}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {m.text.replace(/\s+/g, " ").slice(0, 80)}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )
            ) : (
              // No query yet: browse recent conversations directly
              <>
                <CommandEmpty>No conversations yet.</CommandEmpty>
                {threads && threads.length > 0 && (
                  <CommandGroup heading="Recent chats">
                    {threads.map((t) => (
                      <CommandItem
                        key={t.id}
                        value={t.id}
                        onSelect={() => select(t.id)}
                      >
                        <MessageSquare className="text-muted-foreground" />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {t.title}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {format(new Date(t.updatedAt), "d MMM yyyy, HH:mm")}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
