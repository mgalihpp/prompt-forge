"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const THEMES = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    description: "Bright and clean",
  },
  { value: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes" },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    description: "Follows your OS",
  },
];

/** Mini mock-UI swatch previewing a theme. */
function ThemePreview({ value }: { value: string }) {
  // "system" shows a split light/dark preview.
  const halves = value === "system" ? ["light", "dark"] : [value];

  return (
    <div className="flex h-24 w-full overflow-hidden rounded-lg border">
      {halves.map((half) => (
        <div
          key={half}
          className={cn(
            "flex flex-1 flex-col gap-1.5 p-2.5",
            half === "dark" ? "bg-zinc-900" : "bg-zinc-50",
          )}
        >
          <div
            className={cn(
              "h-2 w-3/4 rounded-full",
              half === "dark" ? "bg-zinc-600" : "bg-zinc-300",
            )}
          />
          <div
            className={cn(
              "h-2 w-1/2 rounded-full",
              half === "dark" ? "bg-zinc-700" : "bg-zinc-200",
            )}
          />
          <div className="mt-auto flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-primary" />
            <div
              className={cn(
                "h-2 flex-1 rounded-full",
                half === "dark" ? "bg-zinc-700" : "bg-zinc-200",
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch: theme is unknown until mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Appearance</h1>
        <p className="text-sm text-muted-foreground">
          Customize how Prompt Forge looks on your device.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {THEMES.map(({ value, label, icon: Icon, description }) => {
          const selected = mounted && theme === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={selected}
              className={cn(
                "group relative flex flex-col gap-3 rounded-xl border p-3 text-left transition-all outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "border-primary ring-1 ring-primary"
                  : "border-border",
              )}
            >
              {selected && (
                <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </span>
              )}
              <ThemePreview value={value} />
              <div className="flex items-start gap-2">
                <Icon
                  className={cn(
                    "mt-0.5 size-4",
                    selected ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
