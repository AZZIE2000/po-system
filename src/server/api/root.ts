// import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/user";
import { companyRouter } from "./routers/company";
import { projectRouter } from "./routers/project";
import { roleRouter } from "./routers/role";
import { purchaseOrderRouter } from "./routers/purchaseOrder";
import { notificationRouter } from "./routers/notifications";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // post: postRouter,
  role: roleRouter,
  user: authRouter,
  company: companyRouter,
  project: projectRouter,
  purchaseOrder: purchaseOrderRouter,
  notification: notificationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
