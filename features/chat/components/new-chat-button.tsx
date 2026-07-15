"use client";

import { Plus } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { newChat } from "../open-thread";

export function NewChatButton() {
  return (
    <SidebarMenuButton tooltip="New chat" onClick={newChat}>
      <Plus /> <span>New chat</span>
    </SidebarMenuButton>
  );
}
