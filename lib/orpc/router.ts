import { forgeRouter } from "./routers/forge";
import { historyRouter } from "./routers/history";
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
};

export type AppRouter = typeof router;
