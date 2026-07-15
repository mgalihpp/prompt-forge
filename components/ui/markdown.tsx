import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

// The app has no `@tailwindcss/typography` plugin, so every element is styled
// by hand here. Kept in one map so assistant output reads like a polished
// document (headings, lists, code, tables) instead of a wall of pre-wrap text.
// Every renderer destructures `node` out — react-markdown passes it along and
// spreading it onto a DOM element emits an invalid `node="[object Object]"`.
const components: Components = {
  p: ({ node: _, className, ...props }) => (
    <p
      className={cn("leading-relaxed [&:not(:first-child)]:mt-3", className)}
      {...props}
    />
  ),
  h1: ({ node: _, className, ...props }) => (
    <h1
      className={cn(
        "mt-5 mb-2 text-lg font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ node: _, className, ...props }) => (
    <h2
      className={cn(
        "mt-5 mb-2 text-base font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ node: _, className, ...props }) => (
    <h3
      className={cn(
        "mt-4 mb-1.5 text-sm font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ node: _, className, ...props }) => (
    <h4
      className={cn(
        "mt-4 mb-1.5 text-sm font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ node: _, className, ...props }) => (
    <h5
      className={cn(
        "mt-3 mb-1 text-sm font-medium tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ node: _, className, ...props }) => (
    <h6
      className={cn(
        "mt-3 mb-1 text-sm font-medium tracking-tight text-muted-foreground first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ node: _, className, ...props }) => (
    <ul
      className={cn(
        "my-3 ml-5 list-disc space-y-1 marker:text-muted-foreground",
        // GFM task lists carry their own checkboxes — drop the bullets.
        "[&.contains-task-list]:ml-0 [&.contains-task-list]:list-none",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ node: _, className, ...props }) => (
    <ol
      className={cn(
        "my-3 ml-5 list-decimal space-y-1 marker:text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  li: ({ node: _, className, ...props }) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  a: ({ node: _, className, ...props }) => (
    <a
      className={cn(
        "font-medium text-primary underline underline-offset-4 hover:text-primary/80",
        className,
      )}
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  strong: ({ node: _, className, ...props }) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  ),
  del: ({ node: _, className, ...props }) => (
    <del
      className={cn("text-muted-foreground line-through", className)}
      {...props}
    />
  ),
  img: ({ node: _, className, alt, ...props }) => (
    // biome-ignore lint/performance/noImgElement: markdown images point at arbitrary remote hosts; next/image would need each domain allowlisted.
    <img
      className={cn("my-3 max-w-full rounded-lg border", className)}
      alt={alt ?? ""}
      loading="lazy"
      {...props}
    />
  ),
  blockquote: ({ node: _, className, ...props }) => (
    <blockquote
      className={cn(
        "my-3 border-l-2 border-border pl-4 text-muted-foreground italic",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ node: _, className, ...props }) => (
    <hr className={cn("my-4 border-border", className)} {...props} />
  ),
  // Inline code gets a chip. Fenced/indented blocks land inside <pre>, whose
  // [&_code] rules strip the chip — so a fence with no language tag (which
  // has no `language-` class and is indistinguishable here) still renders as
  // a proper block instead of a bordered inline pill.
  code: ({ node: _, className, children, ...props }) => (
    <code
      className={cn(
        "rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.85em]",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ node: _, className, ...props }) => (
    <pre
      className={cn(
        "my-3 overflow-x-auto rounded-lg border bg-muted/60 p-3 text-sm",
        "[&_code]:rounded-none [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  table: ({ node: _, className, ...props }) => (
    <div className="my-3 w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  ),
  th: ({ node: _, className, ...props }) => (
    <th
      className={cn(
        "border border-border bg-muted/50 px-3 py-1.5 text-left font-medium",
        className,
      )}
      {...props}
    />
  ),
  td: ({ node: _, className, ...props }) => (
    <td
      className={cn("border border-border px-3 py-1.5", className)}
      {...props}
    />
  ),
  // GFM task lists: bullet off, checkbox aligned with the text.
  input: ({ node: _, className, ...props }) => (
    <input
      className={cn(
        "mr-1.5 size-3.5 translate-y-0.5 accent-primary",
        className,
      )}
      {...props}
    />
  ),
};

const remarkPlugins = [remarkGfm];

function MarkdownImpl({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("text-sm text-foreground", className)}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

// Streaming re-renders this on every token; memo skips work when the text
// (the only thing that changes) is unchanged between sibling messages.
export const Markdown = React.memo(MarkdownImpl);
