# Prompt Forge

Production-ready full-stack app with Clerk auth, oRpc API, TanStack Query, Prisma + MongoDB.

## Quick Start

1. **Setup environment**
   ```bash
   # Update .env.local with:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   DATABASE_URL=mongodb+srv://...
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

2. **Setup database**
   ```bash
   npx prisma db push
   ```

3. **Run**
   ```bash
   npm run dev
   ```

4. **Visit** http://localhost:3000

## Architecture

- **proxy.ts** — Clerk auth gate (Next.js 16)
- **app/api/rpc/[...path]/route.ts** — RPCHandler (oRpc)
- **lib/orpc.ts** — Route definitions (type-safe)
- **lib/tanstack-query.ts** — Query client with SSR hydration
- **app/dashboard/layout.tsx** — Server prefetch + hydration
- **prisma/schema.prisma** — MongoDB schema

## Add Feature

1. Add model to `prisma/schema.prisma`
2. `npx prisma db push`
3. Add routes to `lib/orpc.ts`
4. Use: `useQuery(orpc.route.queryOptions({}))`

See `AGENTS.md` for more details.
