"use client";

import { Check, Copy, Link2, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { copyToClipboard } from "@/lib/forge-utils";
import {
  useDeleteForge,
  useForges,
  useShareForge,
  useToggleFavorite,
} from "@/lib/hooks/use-forges";

export function ForgesView() {
  const { data: forges, isLoading, error } = useForges();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        Couldn't load your forges. Make sure you're signed in.
      </p>
    );
  }

  if (!forges?.length) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        No saved forges yet. Forge a prompt and hit{" "}
        <span className="font-medium text-foreground">Save</span> to keep it
        here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {forges.map((f) => (
        <ForgeCard key={f.id} forge={f} />
      ))}
    </div>
  );
}

type Forge = NonNullable<ReturnType<typeof useForges>["data"]>[number];

function ForgeCard({ forge }: { forge: Forge }) {
  const [copied, setCopied] = useState(false);
  const del = useDeleteForge();
  const fav = useToggleFavorite();
  const share = useShareForge();

  async function copy() {
    if (await copyToClipboard(forge.blade)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Copied");
    }
  }

  function doShare() {
    share.mutate(
      { id: forge.id },
      {
        onSuccess: async (r) => {
          const url = `${window.location.origin}/share/${r.shareId}`;
          await copyToClipboard(url);
          toast.success("Share link copied");
        },
        onError: () => toast.error("Couldn't create share link"),
      },
    );
  }

  const opts = (forge.opts ?? {}) as Record<string, string>;

  return (
    <Card size="sm">
      <CardHeader className="flex-row items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{forge.title}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {opts.mode && <Badge variant="secondary">{opts.mode}</Badge>}
            {opts.target && opts.target !== "Generic" && (
              <Badge variant="outline">{opts.target}</Badge>
            )}
            {forge.deepForge && <Badge variant="outline">Deep</Badge>}
            {forge.shareId && <Badge variant="outline">Shared</Badge>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full"
            onClick={() =>
              fav.mutate({ id: forge.id, favorite: !forge.favorite })
            }
          >
            <Star
              className={
                forge.favorite
                  ? "size-4 fill-amber-400 text-amber-400"
                  : "size-4"
              }
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full"
            onClick={copy}
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full"
            onClick={doShare}
            disabled={share.isPending}
          >
            <Link2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full text-muted-foreground hover:text-destructive"
            onClick={() => del.mutate({ id: forge.id })}
            disabled={del.isPending}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4 text-sm whitespace-pre-wrap text-muted-foreground">
          {forge.blade}
        </p>
      </CardContent>
    </Card>
  );
}
