import { FolderOpen, Hammer, LayoutTemplate, Settings2 } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HistoryGroup } from "@/features/chat/components/history-group";
import { HistorySearch } from "@/features/chat/components/history-search";
import { NavUser } from "@/features/chat/components/nav-user";
import { NewChatButton } from "@/features/chat/components/new-chat-button";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Restore left sidebar state from cookie so SSR matches client (no flash).
  const defaultOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* LEFT: navigation */}
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                size="lg"
                tooltip="Prompt Forge"
                className="group-data-[collapsible=icon]:hidden hover:bg-transparent"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Hammer className="size-4" />
                </div>
                <span className="font-semibold">Prompt Forge</span>
              </SidebarMenuButton>
              <SidebarTrigger />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <NewChatButton />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <HistorySearch />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="My Forges"
                  render={<Link href="/forges" />}
                >
                  <FolderOpen /> <span>My Forges</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="New chat"
                  render={<Link href="/chat" />}
                >
                  <LayoutTemplate /> <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          {/* Chat history: date-grouped thread list */}
          <HistoryGroup />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-3 rounded-xl border p-3 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Free Plan</span>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">0</span> / 10
              prompts used today
            </p>
            <Button variant="glossy" className="w-full">
              Upgrade to Pro
            </Button>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <NavUser />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* CENTER: prompt editor — flex-1, reflows as sidebars collapse */}
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
          <div className="ml-auto flex items-center gap-3">
            <div id="right-sidebar-trigger-slot" />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>

      {/* RIGHT: utility/settings — independent provider = independent toggle */}
      <SidebarProvider defaultOpen={false} className="w-auto">
        <Sidebar side="right" collapsible="offcanvas">
          <SidebarHeader className="flex-row items-center gap-2 px-4">
            <Settings2 className="size-4" />
            <span className="text-sm font-medium">Settings</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {/* model, temperature, tone controls */}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </SidebarProvider>
  );
}
