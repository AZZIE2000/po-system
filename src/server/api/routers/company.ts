import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.company.findMany();
  }),
  create: protectedProcedure
    .input(z.object({ companyName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.company.create({
        data: {
          companyName: input.companyName,
        },
      });
    }),

  tstUser: protectedProcedure.query(async ({ ctx }) => {
    console.log("asd", ctx.session.user);
    return ctx.session.user;
  }),
});
