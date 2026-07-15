"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { defaultOptions, OPTIONS } from "@/features/chat/constants";
import { useCreateTemplate } from "@/lib/hooks/use-templates";

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [ore, setOre] = useState("");
  const [opts, setOpts] = useState<Record<string, string>>(defaultOptions);
  const [deepForge, setDeepForge] = useState(false);
  const create = useCreateTemplate();

  function reset() {
    setLabel("");
    setEmoji("📝");
    setOre("");
    setOpts(defaultOptions());
    setDeepForge(false);
  }

  function submit() {
    create.mutate(
      {
        label: label.trim(),
        emoji: emoji.trim() || "📝",
        ore,
        opts,
        deepForge,
      },
      {
        onSuccess: () => {
          toast.success("Template saved");
          setOpen(false);
          reset();
        },
        onError: () => toast.error("Couldn't save template"),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="glossy" size="sm" />}>
        <Plus className="size-4" /> New template
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New template</DialogTitle>
          <DialogDescription>
            Save a starting prompt and knob setup you can reuse in one click.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex w-16 flex-col gap-1.5">
              <Label htmlFor="template-emoji">Emoji</Label>
              <Input
                id="template-emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={8}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="template-label">Name</Label>
              <Input
                id="template-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Bug report"
                maxLength={60}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-ore">Prompt</Label>
            <Textarea
              id="template-ore"
              value={ore}
              onChange={(e) => setOre(e.target.value)}
              placeholder="The rough prompt this template prefills…"
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(OPTIONS).map(([key, { values }]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <Label className="capitalize">{key}</Label>
                <Select
                  value={opts[key]}
                  onValueChange={(v) =>
                    setOpts((s) => ({ ...s, [key]: v as string }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {values.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="flex items-end justify-between gap-2 pb-2">
              <Label htmlFor="template-deep">Deep Forge</Label>
              <Switch
                id="template-deep"
                checked={deepForge}
                onCheckedChange={setDeepForge}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="glossy"
            size="sm"
            disabled={!label.trim() || !ore.trim() || create.isPending}
            onClick={submit}
          >
            Save template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
