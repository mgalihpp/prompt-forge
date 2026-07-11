"use client";

import {
  Check,
  Copy,
  Download,
  GitCompare,
  RotateCw,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  copyToClipboard,
  type ExportFormat,
  estimateTokens,
  formatForExport,
} from "@/lib/forge-utils";
import { useSaveForge } from "@/lib/hooks/use-forges";
import { useChatStore } from "../store";

/**
 * Action bar shown under a completed forged prompt: token badge, copy, export
 * (plain/markdown/json), diff toggle, save-to-library, and regenerate.
 * `ore` is the preceding user message; may be empty for the very first turn.
 */
export function ForgeActions({
  blade,
  ore,
  showDiff,
  onToggleDiff,
  onRegenerate,
}: {
  blade: string;
  ore: string;
  showDiff: boolean;
  onToggleDiff: () => void;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const opts = useChatStore((s) => s.opts);
  const deepForge = useChatStore((s) => s.deepForge);
  const save = useSaveForge();

  const tokens = estimateTokens(blade);

  async function handleCopy(format: ExportFormat = "text") {
    const text = formatForExport(blade, format, { ore, opts });
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success(format === "text" ? "Copied" : `Copied as ${format}`);
    } else {
      toast.error("Copy failed");
    }
  }

  function handleExport(format: ExportFormat) {
    const text = formatForExport(blade, format, { ore, opts });
    const ext =
      format === "markdown" ? "md" : format === "json" ? "json" : "txt";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forged-prompt.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported .${ext}`);
  }

  function handleSave() {
    if (!ore) {
      toast.error("Nothing to save yet");
      return;
    }
    save.mutate(
      { ore, blade, opts, deepForge },
      {
        onSuccess: () => {
          setSaved(true);
          toast.success("Saved to your forges");
        },
        onError: () => toast.error("Couldn't save — are you signed in?"),
      },
    );
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1">
      <Badge variant="secondary" className="mr-1 font-normal">
        ~{tokens} tokens
      </Badge>

      <IconBtn
        label="Copy"
        onClick={() => handleCopy("text")}
        icon={
          copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )
        }
      />

      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger
            render={
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-full"
                  />
                }
              />
            }
          >
            <Download className="size-3.5" />
          </DropdownMenuTrigger>
          <TooltipContent>Export / copy as…</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleCopy("markdown")}>
            Copy as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCopy("json")}>
            Copy as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("text")}>
            Download .txt
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("markdown")}>
            Download .md
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")}>
            Download .json
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {ore && (
        <IconBtn
          label={showDiff ? "Hide changes" : "Show changes"}
          onClick={onToggleDiff}
          active={showDiff}
          icon={<GitCompare className="size-3.5" />}
        />
      )}

      <IconBtn
        label="Save to library"
        onClick={handleSave}
        disabled={save.isPending || saved}
        icon={
          saved ? <Check className="size-3.5" /> : <Save className="size-3.5" />
        }
      />

      {onRegenerate && (
        <IconBtn
          label="Regenerate"
          onClick={onRegenerate}
          icon={<RotateCw className="size-3.5" />}
        />
      )}
    </div>
  );
}

function IconBtn({
  label,
  icon,
  onClick,
  disabled,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={active ? "secondary" : "ghost"}
            size="icon"
            className="size-7 rounded-full"
            onClick={onClick}
            disabled={disabled}
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
