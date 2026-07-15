"use client";

import { format, isToday, isYesterday } from "date-fns";
import { Download, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useDeleteThread, useThreads } from "@/lib/hooks/use-history";
import { exportThread } from "../export";
import { newChat } from "../open-thread";
import { useChatStore } from "../store";

type Thread = NonNullable<ReturnType<typeof useThreads>["data"]>[number];

function dateGroup(d: Date | string): string {
  const date = new Date(d);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM yyyy");
}

function groupByDate(threads: Thread[]): [string, Thread[]][] {
  const groups: [string, Thread[]][] = [];
  for (const t of threads) {
    const label = dateGroup(t.updatedAt);
    const last = groups.at(-1);
    if (last?.[0] === label) last[1].push(t);
    else groups.push([label, [t]]);
  }
  return groups;
}

function ThreadItem({ thread }: { thread: Thread }) {
  const activeId = useChatStore((s) => s.threadId);
  const router = useRouter();
  const del = useDeleteThread();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <SidebarMenuItem className="group/menu-item">
      <SidebarMenuButton
        isActive={thread.id === activeId}
        render={<Link href={`/chat/${thread.id}`} />}
        onClick={(e) => {
          // Drop focus so the hover-only action doesn't stay pinned visible
          // (SidebarMenuAction shows while the item has focus-within).
          e.currentTarget.blur();
        }}
        className="h-auto py-1.5"
        tooltip={thread.title}
      >
        <div className="flex min-w-0 flex-col items-start">
          <span className="w-full truncate text-sm text-sidebar-foreground/70 transition-colors group-hover/menu-button:text-sidebar-accent-foreground group-data-active/menu-button:text-sidebar-accent-foreground">
            {thread.title}
          </span>
          <span className="w-full truncate text-xs text-muted-foreground">
            {format(new Date(thread.updatedAt), "d MMM, HH:mm")}
          </span>
        </div>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuAction
              showOnHover
              title="More actions"
              className="text-muted-foreground"
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-44">
          <DropdownMenuItem
            onClick={() =>
              exportThread(thread.id).catch(() => toast.error("Export failed"))
            }
          >
            <Download /> Export as text
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              “{thread.title}” and all of its messages will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() =>
                del.mutate(
                  { threadId: thread.id },
                  {
                    onSuccess: () => {
                      // If the open conversation was deleted, reset the surface.
                      if (useChatStore.getState().threadId === thread.id) {
                        newChat();
                        router.push("/chat");
                      }
                    },
                    onError: () => toast.error("Couldn't delete conversation"),
                  },
                )
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarMenuItem>
  );
}

export function HistoryGroup() {
  const { data: threads = [], isPending } = useThreads();

  if (isPending) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Today</SidebarGroupLabel>
        <SidebarMenu>
          {["a", "b", "c", "d", "e"].map((k) => (
            <SidebarMenuItem key={k}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return groupByDate(threads).map(([label, group]) => (
    <SidebarGroup key={label} className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {group.map((t) => (
          <ThreadItem key={t.id} thread={t} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ));
}
