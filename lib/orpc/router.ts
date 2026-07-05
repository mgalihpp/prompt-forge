import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/user";

// Add new domain routers here — one file per domain under lib/orpc/routers/
export const router = {
  user: userRouter,
  project: projectRouter,
};

export type AppRouter = typeof router;
