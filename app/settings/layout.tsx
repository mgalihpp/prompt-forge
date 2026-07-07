"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, CreditCard, Palette, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    group: "Account",
    items: [
      { href: "/settings", label: "General", icon: Settings },
      { href: "/settings/appearance", label: "Appearance", icon: Palette },
    ],
  },
  {
    group: "Billing",
    items: [
      { href: "/settings/billing", label: "Billing & plan", icon: CreditCard },
    ],
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-svh overflow-hidden">
      {/* LEFT: settings nav */}
      <aside className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-sidebar p-4">
        <Link
          href="/chat"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> Go back
        </Link>
        <nav className="flex flex-col gap-4">
          {NAV.map((section) => (
            <div key={section.group} className="flex flex-col gap-1">
              <span className="px-2 text-xs font-medium text-muted-foreground">
                {section.group}
              </span>
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                    pathname === href
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" /> {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* RIGHT: content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
