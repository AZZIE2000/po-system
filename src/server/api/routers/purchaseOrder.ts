import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const purchaseOrderRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ purchaseOrderId: z.string() }))
    .query(({ ctx, input }) => {
      const { purchaseOrderId } = input;
      return ctx.db.purchaseOrder.findUnique({
        where: {
          purchaseOrderId,
        },
        include: {
          PurchaseOrderDetails: {
            include: {
              PurchaseOrderItems: true,
              PurchaseOrderInstallments: true,
            },
          },
          userApprove: true,
          userPrepare: true,
          userReview: true,
          PurchaseOrderLogs: true,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ purchaseOrderId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { purchaseOrderId } = input;
      return ctx.db.purchaseOrder.findUnique({
        where: {
          purchaseOrderId,
        },
        include: {
          PurchaseOrderDetails: {
            include: {
              PurchaseOrderItems: true,
              PurchaseOrderInstallments: true,
            },
          },
          userApprove: true,
          userPrepare: true,
          userReview: true,
          PurchaseOrderLogs: true,
        },
      });
    }),
});
