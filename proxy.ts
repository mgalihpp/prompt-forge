import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// `/api/rpc` is public at the transport level — individual oRpc procedures
// enforce their own auth (see `authed` in lib/orpc/base.ts), so public
// procedures like forge.getPublic must remain reachable without a session.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/share(.*)",
  "/api/rpc(.*)",
]);

export const proxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
