"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import {
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Palette,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

export function NavUser() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isMobile } = useSidebar();
  const router = useRouter();

  const name = user?.fullName ?? "Account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const avatar = user?.imageUrl;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
          />
        }
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {email}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-1.5"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2 rounded-md py-2 text-xs"
            onClick={() => router.push("/settings")}
          >
            <Settings className="size-4 text-muted-foreground" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 rounded-md py-2 text-xs"
            onClick={() => router.push("/settings/appearance")}
          >
            <Palette className="size-4 text-muted-foreground" /> Appearance
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 rounded-md py-2 text-xs"
            onClick={() => router.push("/settings/billing")}
          >
            <CreditCard className="size-4 text-muted-foreground" /> Billing &
            plan
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 rounded-md py-2 text-xs"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <LogOut className="size-4 text-muted-foreground" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
