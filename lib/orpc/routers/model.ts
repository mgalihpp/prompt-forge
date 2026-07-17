import { getModels } from "@/lib/models";
import { base } from "@/lib/orpc/base";

export const modelRouter = {
  // Public: the model catalog powering the composer's model picker (free
  // models + curated pro models, each tagged with a `tier`). No auth — the
  // list itself isn't user-specific; per-request gating happens in the chat
  // route. Cached server-side in lib/models.ts.
  list: base.handler(() => getModels()),
};
