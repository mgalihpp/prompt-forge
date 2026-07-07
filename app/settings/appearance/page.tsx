"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Appearance</h1>
        <p className="text-sm text-muted-foreground">
          Customize how Prompt Forge looks on your device.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {THEMES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm hover:bg-accent",
              theme === value
                ? "border-primary ring-1 ring-primary"
                : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
