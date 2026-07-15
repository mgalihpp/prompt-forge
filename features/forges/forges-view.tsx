"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Copy,
  Hammer,
  Link2,
  Link2Off,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/forge-utils";
import {
  useDeleteForge,
  useForges,
  useShareForge,
  useToggleFavorite,
  useUnshareForge,
} from "@/lib/hooks/use-forges";

export function ForgesView() {
  const { data: forges, isLoading, error } = useForges();
  const filter = useSearchParams().get("filter");

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {["a", "b", "c", "d"].map((k) => (
          <Skeleton key={k} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Empty className="border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Hammer />
          </EmptyMedia>
          <EmptyTitle>Couldn't load your forges</EmptyTitle>
          <EmptyDescription>Make sure you're signed in.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const visible = (forges ?? []).filter((f) => {
    if (filter === "favorites") return f.favorite;
    if (filter === "shared") return Boolean(f.shareId);
    return true;
  });

  if (!visible.length) {
    return (
      <Empty className="border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Hammer />
          </EmptyMedia>
          <EmptyTitle>
            {filter === "favorites"
              ? "No favorites yet"
              : filter === "shared"
                ? "Nothing shared yet"
                : "No saved forges yet"}
          </EmptyTitle>
          <EmptyDescription>
            {filter
              ? "Forges you mark will show up here."
              : "Forge a prompt and hit Save to keep it here."}
          </EmptyDescription>
        </EmptyHeader>
        {!filter && (
          <Button variant="glossy" size="sm" render={<Link href="/chat" />}>
            Start forging
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visible.map((f) => (
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
  const unshare = useUnshareForge();

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

  function doUnshare() {
    unshare.mutate(
      { id: forge.id },
      {
        onSuccess: () => toast.success("Share link removed"),
        onError: () => toast.error("Couldn't remove share link"),
      },
    );
  }

  const opts = (forge.opts ?? {}) as Record<string, string>;

  return (
    <Card
      size="sm"
      className="group/forge relative flex flex-col gap-3 transition-shadow hover:shadow-md"
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 size-7 rounded-full"
              onClick={() =>
                fav.mutate({ id: forge.id, favorite: !forge.favorite })
              }
            />
          }
        >
          <Star
            className={
              forge.favorite ? "size-4 fill-amber-400 text-amber-400" : "size-4"
            }
          />
        </TooltipTrigger>
        <TooltipContent>
          {forge.favorite ? "Unfavorite" : "Favorite"}
        </TooltipContent>
      </Tooltip>
      <CardHeader>
        <div className="min-w-0 pe-8">
          <p className="truncate font-medium">{forge.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(forge.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-3 rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap text-muted-foreground">
          {forge.blade}
        </p>
      </CardContent>

      <CardFooter className="items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap gap-1">
          {opts.mode && <Badge variant="secondary">{opts.mode}</Badge>}
          {opts.target && opts.target !== "Generic" && (
            <Badge variant="outline">{opts.target}</Badge>
          )}
          {forge.deepForge && <Badge variant="outline">Deep</Badge>}
          {forge.shareId && <Badge variant="outline">Shared</Badge>}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-full opacity-60 transition-opacity hover:opacity-100"
                  onClick={copy}
                />
              }
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>Copy prompt</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-full opacity-60 transition-opacity hover:opacity-100"
                  onClick={forge.shareId ? doUnshare : doShare}
                  disabled={share.isPending || unshare.isPending}
                />
              }
            >
              {forge.shareId ? (
                <Link2Off className="size-4" />
              ) : (
                <Link2 className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {forge.shareId ? "Remove share link" : "Copy share link"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-full text-muted-foreground opacity-60 transition-opacity hover:text-destructive hover:opacity-100"
                  onClick={() => del.mutate({ id: forge.id })}
                  disabled={del.isPending}
                />
              }
            >
              <Trash2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}
