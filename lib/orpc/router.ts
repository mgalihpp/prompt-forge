import { forgeRouter } from "./routers/forge";
import { historyRouter } from "./routers/history";
import { modelRouter } from "./routers/model";
import { projectRouter } from "./routers/project";
import { templateRouter } from "./routers/template";
import { userRouter } from "./routers/user";

// Add new domain routers here — one file per domain under lib/orpc/routers/
export const router = {
  user: userRouter,
  project: projectRouter,
  forge: forgeRouter,
  history: historyRouter,
  template: templateRouter,
  model: modelRouter,
};

export type AppRouter = typeof router;
