"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { newChat } from "../open-thread";

export function NewChatButton() {
  const router = useRouter();

  return (
    <SidebarMenuButton
      tooltip="New chat"
      onClick={() => {
        newChat();
        router.push("/chat");
      }}
    >
      <Plus /> <span>New chat</span>
    </SidebarMenuButton>
  );
}
