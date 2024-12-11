import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getProjectsAndTotal: protectedProcedure
    .input(z.object({ companyName: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.company.create({
        data: {
          companyName: input.companyName,
        },
      });
    }),
});
