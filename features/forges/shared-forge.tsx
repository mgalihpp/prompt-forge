"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { ForgyLogo } from "@/components/forgy-logo";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { copyToClipboard } from "@/lib/forge-utils";
import { orpc } from "@/lib/orpc/client";

export function SharedForge({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false);
  const { data, isLoading, error } = useQuery(
    orpc.forge.getPublic.queryOptions({ input: { shareId } }),
  );

  async function copy() {
    if (data && (await copyToClipboard(data.blade))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Copied");
    }
  }

  const opts = (data?.opts ?? {}) as Record<string, string>;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <Link
        href="/chat"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <ForgyLogo className="size-6" />
        Prompt Forge
      </Link>

      {isLoading && (
        <div className="flex justify-center py-20 text-muted-foreground">
          <Spinner className="size-5" />
        </div>
      )}

      {error && (
        <p className="py-20 text-center text-sm text-muted-foreground">
          This shared prompt doesn't exist or was unshared.
        </p>
      )}

      {data && (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-medium">{data.title}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {opts.mode && <Badge variant="secondary">{opts.mode}</Badge>}
                {opts.target && opts.target !== "Generic" && (
                  <Badge variant="outline">{opts.target}</Badge>
                )}
                {data.deepForge && <Badge variant="outline">Deep Forge</Badge>}
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={copy}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 whitespace-pre-wrap">
              {data.blade}
            </div>
          </CardContent>
        </Card>
      )}

      <Link
        href="/chat"
        className="text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Forge your own prompt →
      </Link>
    </div>
  );
}
