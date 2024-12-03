import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        closed: {
          equals: false,
        },
      },
    });
  }),
  getDashboard: publicProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ projectName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          projectName: input.projectName,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        projectName: z.string().min(1),
        projectId: z.string().min(1),
        closed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: {
          projectId: input.projectId,
        },
        data: {
          projectName: input.projectName,
          closed: input.closed,
        },
      });
    }),

  tstUser: protectedProcedure.query(async ({ ctx }) => {
    console.log("asd", ctx.session.user);
    return ctx.session.user;
  }),
});
