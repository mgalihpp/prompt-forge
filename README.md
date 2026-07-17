# Prompt Forge

AI-powered prompt engineering workbench. Draft, refine, and version prompts with
streaming AI assistance — including **Deep Forge** (multi-variant A/B/C generation
with a comparative critic pass), chat history, project organization, favorites,
and public share links.

Built with Next.js 16, React 19, Clerk, oRpc, TanStack Query, Prisma + MongoDB,
and the Vercel AI SDK via OpenRouter.

## Features

- **Streaming AI chat** — prompt forging via Vercel AI SDK + OpenRouter
- **Deep Forge** — generates A/B/C prompt variants, then a comparative critic pass picks and refines the best
- **Projects & forges** — organize prompts, favorite them, share via public links
- **Chat history** — persisted threads with search (oldest trimmed at 100)
- **Daily quota** — server-side per-user prompt limits with rate limiting

## Quick Start

1. **Setup environment** — copy `.env.example` to `.env.local` and fill in:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   DATABASE_URL=mongodb+srv://...
   OPENROUTER_API_KEY=sk-or-...
   OPENROUTER_MODEL=openai/gpt-4o-mini   # any OpenRouter model id
   ```

2. **Install & setup database**
   ```bash
   bun install
   bun run db:push
   ```

3. **Run**
   ```bash
   bun run dev
   ```

4. **Visit** http://localhost:3000

## Commands

```bash
bun run dev           # start dev server
bun run build         # production build
bun run lint          # biome check
bun run format        # biome format --write
bun run db:push       # prisma db push
bun run db:generate   # prisma generate (also runs on postinstall)
bun run eval          # LLM prompt eval suite
```

## Architecture

- **`proxy.ts`** — Clerk auth gate (Next.js 16 uses `proxy.ts`, not `middleware.ts`)
- **`app/api/rpc/[[...rest]]/route.ts`** — oRpc HTTP handler
- **`lib/orpc/router.ts`** — route registry (`user`, `project`, `forge`, `history`)
- **`lib/orpc/server.ts`** — SSR direct client (no HTTP round-trip during pre-render)
- **`lib/query-client.ts`** — TanStack Query client with custom serializer
- **`app/(chat)/chat/layout.tsx`** — canonical SSR prefetch + hydration template
- **`app/api/chat/route.ts`** — AI chat streaming (Vercel AI SDK + OpenRouter)
- **`prisma/schema.prisma`** — MongoDB schema

## Contributing / Adding a Feature

See [AGENTS.md](./AGENTS.md) for the full feature workflow (Prisma model →
`db:push` → oRpc route in `lib/orpc/routers/` → hook in `lib/hooks/`),
SSR hydration patterns, and Base UI gotchas.
