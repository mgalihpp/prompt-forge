"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function GeneralSettingsPage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  const name = user?.fullName ?? "Account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">General</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details and profile.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border p-4">
        <Avatar className="size-12">
          <AvatarImage src={user?.imageUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => openUserProfile()}>
          Manage account
        </Button>
      </div>
    </div>
  );
}
