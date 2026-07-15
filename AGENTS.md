# Prompt Forge

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Auth**: Clerk (`proxy.ts`, not `middleware.ts`)
- **API**: oRpc (type-safe RPC via `@orpc/server`, `@orpc/client`, `@orpc/tanstack-query`)
- **State**: TanStack Query (SSR hydration via `HydrationBoundary`)
- **DB**: Prisma 6 + MongoDB
- **UI**: shadcn/ui (`base-nova` style) + `@base-ui/react` v1
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/react`) + OpenRouter provider
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), `tw-animate-css`
- **Format/Lint**: Biome 2.2 (`bun run lint`, `bun run format`)

## Commands

```bash
bun run dev           # next dev
bun run build         # next build
bun run format        # biome format --write
bun run lint          # biome check
bun run db:push       # prisma db push
bun run db:generate   # prisma generate
bun run eval          # bun run eval/run.ts — LLM prompt eval suite
```

`prisma generate` runs automatically on `postinstall`. No separate test command exists.

## Auth Gate

`proxy.ts` is Next.js 16's auth middleware (not `middleware.ts`). It protects all routes except `/sign-in`, `/sign-up`, `/`, `/share/*`, and `/api/rpc/*`. Individual oRpc procedures enforce their own auth via `authed` middleware.

## API: oRpc Setup

Routes defined in `lib/orpc/routers/*.ts`, registered in `lib/orpc/router.ts`:

```
user    — me, profile, usage
project — list, create, update, delete
forge   — list, get, create, delete, toggleFavorite, share, unshare, getPublic
history — threads, messages, createThread, search, deleteMessages, deleteThread
```

HTTP handler at `app/api/rpc/[[...rest]]/route.ts` — catches all methods (GET/POST/PUT/PATCH/DELETE).

Context factory at `lib/orpc/context.ts` — injects `userId` from Clerk.

Two auth levels in `lib/orpc/base.ts`:
- `base` — userId may be null (public endpoints like `forge.getPublic`)
- `authed` — throws UNAUTHORIZED if no userId

## SSR Pattern

1. `instrumentation.ts` imports `lib/orpc/server.ts` which sets `globalThis.$client` — calls router directly (no HTTP) during SSR/pre-render.
2. Server layouts prefetch via `getQueryClient()` + `orpc.*.queryOptions()`, then `dehydrate` into `HydrationBoundary`.
3. Client components read from cache: `useQuery(orpc.*.queryOptions())`.
4. The `serializer` in `lib/orpc/serializer.ts` handles Date/Map/Set serialization for hydration.

**Important**: Use `app/dashboard/layout.tsx` as the canonical SSR hydration template. The client-side provider is in `app/providers.tsx`.

## Chat Architecture

- Single shared `Chat` instance exported from `features/chat/chat-instance.ts` — not the `id` string, but the instance itself. Both `Composer` and `MessageList` reference it.
- Chat API at `app/api/chat/route.ts` — streams via AI SDK, supports `deepForge` (draft → reflection pass).
- Daily quota enforced server-side via `trySpendPrompt()` from `lib/usage.ts` (atomic upsert-increment, returns 429).
- History persistence via Prisma: `ChatThread` + `ChatMessage` models. Oldest threads trimmed at 100.
- Composer state (input, opts, deepForge, threadId) lives in a Zustand store at `features/chat/store.ts`.

## Base UI Pitfall

`@base-ui/react/button`'s `Button` defaults `nativeButton={true}`. When using `render={<Link />}` (which renders `<a>`), you **must** pass `nativeButton={false}` or Base UI logs a console error and breaks accessibility semantics.

## Key Files

| File | Role |
|------|------|
| `proxy.ts` | Auth gate (Next.js 16) |
| `app/api/rpc/[[...rest]]/route.ts` | oRpc HTTP handler |
| `lib/orpc/router.ts` | Route registry |
| `lib/orpc/server.ts` | SSR direct client |
| `lib/orpc/client.ts` | Isomorphic client + TanStack utils |
| `lib/query-client.ts` | QueryClient with custom serializer |
| `lib/query-client.server.ts` | Per-request server QueryClient |
| `lib/ai.ts` | OpenRouter model config |
| `lib/usage.ts` | Daily prompt quota |
| `lib/plans.ts` | Client-safe plan constants |
| `features/chat/chat-instance.ts` | Shared Chat instance |
| `features/chat/store.ts` | Composer Zustand store |

## Adding a Feature

1. Add model to `prisma/schema.prisma`
2. `bun run db:push`
3. Add routes in `lib/orpc/routers/*.ts`, register in `lib/orpc/router.ts`
4. Create hooks in `lib/hooks/` using `useQuery`/`useMutation` with `orpc.*.queryOptions()`/`mutationOptions()`
5. Invalidate relevant queries on mutation success
