"use client";

import { ChevronLeft, FolderOpen, Link2, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { filter: null, label: "All forges", icon: FolderOpen },
  { filter: "favorites", label: "Favorites", icon: Star },
  { filter: "shared", label: "Shared", icon: Link2 },
] as const;

function ForgesNav() {
  const active = useSearchParams().get("filter");

  return (
    <nav className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="px-2 text-xs font-medium text-muted-foreground">
          Library
        </span>
        {NAV.map(({ filter, label, icon: Icon }) => (
          <Link
            key={label}
            href={filter ? `/forges?filter=${filter}` : "/forges"}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
              active === filter
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            <Icon className="size-4" /> {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function ForgesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh overflow-hidden">
      {/* LEFT: library nav — mirrors the settings layout */}
      <aside className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-sidebar p-4">
        <Link
          href="/chat"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> Go back
        </Link>
        <Suspense>
          <ForgesNav />
        </Suspense>
      </aside>

      {/* RIGHT: content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
