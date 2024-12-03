import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { createPOSchema } from "@/validation/purchaseOrder";
import { PurchaseOrderDetails } from "@prisma/client";

export const purchaseOrderRouter = createTRPCRouter({
  getOne: publicProcedure
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
              project: true,
              company: true,
            },
          },
        },
      });
    }),
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
              project: true,
              company: true,
            },
          },
          userApprove: true,
          userPrepare: true,
          userReview: true,
          PurchaseOrderLogs: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(createPOSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);

      const po = await ctx.db.purchaseOrder.upsert({
        where: {
          purchaseOrderId: input.purchaseOrderId || "",
        },
        create: {
          paid: input.paid,
          status: input.status,
          userApproveId: input.userApproveId,
          userReviewId: input.userReviewId,
          userPrepareId: ctx.session.user.id,
        },
        update: {
          paid: input.paid,
          status: input.status,
          userApproveId: input.userApproveId,
          userReviewId: input.userReviewId,
          userPrepareId: ctx.session.user.id,
        },
      });
      console.log(input.status);

      const podPayload = {
        paymentMethod: input.paymentMethod,
        cliq: input.paymentMethod === "CLIQ" ? input.cliq || null : null,
        description: input.description || null,
        contactName: input.contactName || null,
        contactNumber: input.contactNumber || null,
        currency: input.currency,
        iban:
          input.paymentMethod === "bankTransfer" ? input.iban || null : null,
        nameOnCheque:
          input.paymentMethod === "cheque" ? input.nameOnCheque || null : null,
        companyId: input.companyId || "",
        date: input.date,
        installment: input.installment,
        totalAmount: +input.totalAmount,
        purchaseOrderId: po.purchaseOrderId,
        projectId: input.projectId || "",
      };

      const poDetails = await ctx.db.purchaseOrderDetails.upsert({
        where: {
          purchaseOrderId: po.purchaseOrderId,
        },
        create: {
          ...podPayload,
        },
        update: {
          ...podPayload,
        },
      });
      // upsert items and await them
      const itemsToUpdate = input.items.filter((i) => !!i.purchaseOrderItemId);

      const itemsToCreate = input.items.filter((i) => !i.purchaseOrderItemId);
      console.log(itemsToUpdate);
      console.log(itemsToCreate);
      const createdItems = await ctx.db.purchaseOrderItem.createManyAndReturn({
        data: itemsToCreate
          .filter((i) => i.priceTax > 0)
          .map((i) => {
            const { purchaseOrderItemId, ...rest } = i;
            return {
              ...rest,
              purchaseOrderDetailId: poDetails.purchaseOrderDetailId,
            };
          }),
      });

      await Promise.all(
        itemsToUpdate
          .filter((i) => i.priceTax > 0)
          .map(async (item) => {
            const { purchaseOrderItemId, ...rest } = item;
            console.log({
              where: {
                purchaseOrderItemId: item.purchaseOrderItemId,
              },
              data: {
                ...rest,
                purchaseOrderDetailId: poDetails.purchaseOrderDetailId,
              },
            });

            return await ctx.db.purchaseOrderItem.update({
              where: {
                purchaseOrderItemId: item.purchaseOrderItemId,
              },
              data: {
                ...rest,
                purchaseOrderDetailId: poDetails.purchaseOrderDetailId,
              },
            });
          }),
      );

      // upsert installments and await them
      const installments = await Promise.all(
        input.installments
          .filter((i) => i.amount > 0)
          .map(async (installment) => {
            return await ctx.db.purchaseOrderInstallment.upsert({
              where: {
                PurchaseOrderInstallmentId:
                  installment.PurchaseOrderInstallmentId || "",
              },
              create: {
                ...installment,
                purchaseOrderDetailId: poDetails.purchaseOrderDetailId,
              },
              update: {
                ...installment,
                purchaseOrderDetailId: poDetails.purchaseOrderDetailId,
              },
            });
          }),
      );

      // if installments is false delete all installments
      if (!input.installments && input.purchaseOrderDetailId) {
        await ctx.db.purchaseOrderInstallment.deleteMany({
          where: {
            purchaseOrderDetailId: poDetails.purchaseOrderDetailId,
          },
        });
      }

      await ctx.db.purchaseOrderLogs.create({
        data: {
          userId: ctx.session.user.id,
          action: input.purchaseOrderDetailId ? "update" : "create",
          purchaseOrderId: po.purchaseOrderId,
          log: `${ctx.session.user.username} ${input.purchaseOrderDetailId ? "updated" : "created"} the purchase order`,
        },
      });

      console.log(po);
      console.log(poDetails);
      // console.log(items);
      console.log(installments);
      return po;
    }),

  deleteItem: protectedProcedure
    .input(z.object({ purchaseOrderItemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.purchaseOrderItem.delete({
        where: {
          purchaseOrderItemId: input.purchaseOrderItemId,
        },
      });
    }),

  deleteInstallment: protectedProcedure
    .input(z.object({ PurchaseOrderInstallmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.purchaseOrderInstallment.delete({
        where: {
          PurchaseOrderInstallmentId: input.PurchaseOrderInstallmentId,
        },
      });
    }),
});
