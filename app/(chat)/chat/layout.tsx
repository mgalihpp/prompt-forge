import { cookies } from "next/headers"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { History, Plus, Settings2 } from "lucide-react"

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Restore left sidebar state from cookie so SSR matches client (no flash).
  const defaultOpen = (await cookies()).get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-svh overflow-hidden">
      {/* LEFT: navigation */}
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="New prompt">
                <Plus /> <span>New prompt</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="History">
                  <History /> <span>History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>

      {/* CENTER: prompt editor — flex-1, reflows as sidebars collapse */}
      <SidebarInset className="flex flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">Prompt Enhancer</h1>
          <div className="ml-auto" id="right-sidebar-trigger-slot" />
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
            <SidebarGroup>{/* model, temperature, tone controls */}</SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </SidebarProvider>
  )
}
