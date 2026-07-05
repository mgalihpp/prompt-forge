import { StandardRPCJsonSerializer } from "@orpc/client/standard";

// Shared serializer so SSR-dehydrated data (Date, Set, Map, etc.) survives hydration
export const serializer = new StandardRPCJsonSerializer();
