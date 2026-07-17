import { getFreeModels } from "@/lib/models";
import { base } from "@/lib/orpc/base";

export const modelRouter = {
  // Public: the free-model catalog powering the composer's model picker.
  // No auth — the list itself isn't user-specific, and the landing page can
  // preview it. Cached server-side in lib/models.ts.
  list: base.handler(() => getFreeModels()),
};
