export async function register() {
  // Sets globalThis.$client so SSR calls the router directly (no HTTP hop)
  await import("./lib/orpc/server");
}
