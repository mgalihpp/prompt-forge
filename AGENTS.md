# Production Stack

## Tech Stack
- **Frontend**: Next.js 16 (App Router) + React 19
- **Auth**: Clerk (via proxy.ts in Next.js 16)
- **API**: oRpc (type-safe RPC)
- **State**: TanStack Query + SSR Hydration
- **DB**: Prisma + MongoDB
- **UI**: shadcn/ui + Base UI

## Critical Files
- `proxy.ts` — Auth gate (Next.js 16 style, not middleware.ts)
- `app/api/rpc/[...path]/route.ts` — RPCHandler with context injection
- `lib/orpc.ts` — Route definitions
- `lib/tanstack-query.ts` — Query client with hydration
- `lib/server-client.ts` — Server-side oRpc (direct calls, no HTTP)
- `app/dashboard/layout.tsx` — Prefetch + dehydrate for SSR
- `prisma/schema.prisma` — MongoDB schema

## API Setup

Routes in `lib/orpc.ts`:
```typescript
export const appRouter = orpc.router({
  user: orpc.router({
    me: orpc.handler(async ({ context }) => {...}),
    profile: orpc.input(...).handler(...),
  }),
  project: orpc.router({
    list: orpc.handler(async ({ context }) => {...}),
    create: orpc.input(...).handler(...),
    update: orpc.input(...).handler(...),
    delete: orpc.input(...).handler(...),
  }),
})
```

Context includes `userId` from Clerk auth - use to filter user data.

## Client Usage

Fetch data:
```typescript
const { data } = useQuery(orpc.project.list.queryOptions({}))
```

Create data:
```typescript
const { mutate } = useMutation(orpc.project.create.mutationOptions())
mutate({ title: 'New' })
```

## SSR Hydration

Server prefetch in layout:
```typescript
// app/dashboard/layout.tsx
await queryClient.prefetchQuery(serverOrpc.user.me.queryOptions({}))
return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
```

Client gets data from cache:
```typescript
// app/dashboard/page.tsx
const { data } = useQuery(orpc.user.me.queryOptions({}))  // Already cached
```

## Setup

1. Update `.env.local` with Clerk keys and MongoDB URL
2. `npx prisma db push` — Create collections
3. `npm run dev` — Start server
4. Visit http://localhost:3000

## Add Feature

1. Add model to `prisma/schema.prisma`
2. `npx prisma db push`
3. Add routes to `lib/orpc.ts`
4. Use in component: `useQuery(orpc.route.queryOptions({}))`

## Common Docs
- oRpc: https://orpc.dev
- TanStack Query: https://tanstack.com/query
- Clerk: https://clerk.com/docs
- Prisma: https://prisma.io/docs
