import "server-only";

import { cache } from "react";
import { createQueryClient } from "./query-client";

// One QueryClient per server request (for prefetch + dehydrate)
export const getQueryClient = cache(createQueryClient);
