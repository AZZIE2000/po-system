import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { createPOSchema } from "@/validation/purchaseOrder";
import { PurchaseOrderDetails } from "@prisma/client";
export const generateNotificationText = (
  projectName: string,
  companyName: string,
  username: string,
  type:
    | "toReview"
    | "toApprove"
    | "rejected"
    | "approve review"
    | "toPay"
    | "approved" = "toReview",
  comment: string = "",
) => {
  if (type === "toReview") {
    return `New Purchase Order for ${projectName || ""} - ${companyName || ""} created by ${username} ready for your review.`;
  } else if (type === "toApprove") {
    return `New Purchase Order for ${projectName || ""} - ${companyName || ""} created by ${username} ready for your approval.`;
  } else if (type === "rejected") {
    return (
      `Purchase Order for ${projectName || ""} - ${companyName || ""} was rejected by ${username}` +
      `${comment ? ` with the reason: ${comment}.` : "."}`
    );
  } else if (type === "approve review") {
    return `Purchase Order for ${projectName || ""} - ${companyName || ""} review was approved by ${username}`;
  } else if (type === "approved") {
    return `Purchase Order for ${projectName || ""} - ${companyName || ""} was approved by ${username}`;
  } else if (type === "toPay") {
    return `New Purchase Order for ${projectName || ""} - ${companyName || ""} is ready for payment.`;
  } else {
    return "";
  }
};
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
  getOneReview: publicProcedure
    .input(z.object({ purchaseOrderId: z.string() }))
    .query(({ ctx, input }) => {
      const { purchaseOrderId } = input;
      return ctx.db.purchaseOrder.findUnique({
        where: {
          purchaseOrderId,
          OR: [
            {
              userReviewId: ctx?.session?.user.id,
              // status: "toReview",
            },
            {
              userApproveId: ctx?.session?.user.id,
              // status: "toApprove",
            },
            {
              userPrepareId: ctx?.session?.user.id,
            },
          ],
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
  aproval: protectedProcedure
    .input(
      z.object({
        status: z.boolean(),
        purchaseOrderId: z.string(),
        comment: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { status, purchaseOrderId, comment } = input;
      const po = await ctx.db.purchaseOrder.findUnique({
        where: {
          purchaseOrderId,
        },
        include: {
          userApprove: true,
          userPrepare: true,
          userReview: true,
          PurchaseOrderDetails: {
            include: {
              project: true,
              company: true,
            },
          },
        },
      });
      if (!po) return;
      let nextStatus = "rejected";
      if (status) {
        nextStatus = po?.status === "toReview" ? "toApprove" : "approved";
      } else {
        nextStatus = "rejected";
      }
      console.log(nextStatus);

      await ctx.db.purchaseOrder.update({
        where: {
          purchaseOrderId,
        },
        data: {
          status: status
            ? po?.status === "toReview"
              ? "toApprove"
              : "approved"
            : "rejected",
        },
      });

      let notifications = [];
      if (!status) {
        const n1 = await ctx.db.notification.create({
          data: {
            purchaseOrderId: po.purchaseOrderId,
            opened: false,
            seen: false,
            text: generateNotificationText(
              po.PurchaseOrderDetails?.project?.projectName || "",
              po.PurchaseOrderDetails?.company?.companyName || "",
              ctx.session.user.username || "",
              "rejected",
              comment,
            ),
            userId: po.userPrepareId,
          },
        });

        notifications.push(n1);
      } else {
        if (nextStatus === "toApprove") {
          const n1 = await ctx.db.notification.create({
            data: {
              purchaseOrderId: po.purchaseOrderId,
              opened: false,
              seen: false,
              text: generateNotificationText(
                po.PurchaseOrderDetails?.project?.projectName || "",
                po.PurchaseOrderDetails?.company?.companyName || "",
                po.userPrepare.username || "",
                "toApprove",
              ),
              userId: po.userApproveId,
            },
          });

          const n2 = await ctx.db.notification.create({
            data: {
              purchaseOrderId: po.purchaseOrderId,
              opened: false,
              seen: false,
              text: generateNotificationText(
                po.PurchaseOrderDetails?.project?.projectName || "",
                po.PurchaseOrderDetails?.company?.companyName || "",
                ctx.session.user.username || "",
                "approve review",
              ),
              userId: po.userPrepareId,
            },
          });

          notifications.push(n1);
          notifications.push(n2);
        } else if (nextStatus === "approved") {
          const n3 = await ctx.db.notification.create({
            data: {
              purchaseOrderId: po.purchaseOrderId,
              opened: false,
              seen: false,
              text: generateNotificationText(
                po.PurchaseOrderDetails?.project?.projectName || "",
                po.PurchaseOrderDetails?.company?.companyName || "",
                ctx.session.user.username || "",
                "approved",
              ),
              userId: po.userPrepareId,
            },
          });

          const allAccountants = await ctx.db.user.findMany({
            where: {
              role: {
                role: "accountant",
              },
            },
            include: {
              role: true,
            },
          });

          const allNotifiForAccountants = await Promise.all(
            allAccountants.map(async (accountant) => {
              return await ctx.db.notification.create({
                data: {
                  purchaseOrderId: po.purchaseOrderId,
                  opened: false,
                  seen: false,
                  text: generateNotificationText(
                    po.PurchaseOrderDetails?.project?.projectName || "",
                    po.PurchaseOrderDetails?.company?.companyName || "",
                    ctx.session.user.username || "",
                    "approved",
                  ),
                  userId: accountant.id,
                },
              });
            }),
          );

          notifications.push(n3);
          notifications.push([...allNotifiForAccountants]);
        }
      }
      return { nextStatus, notifications };
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
      let notficationText = "";
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
      if (input.status == "toReview") {
        const pro = await ctx.db.project.findUnique({
          where: {
            projectId: input.projectId,
          },
        });
        const com = await ctx.db.company.findUnique({
          where: {
            companyId: input.companyId,
          },
        });
        await ctx.db.notification.create({
          data: {
            purchaseOrderId: po.purchaseOrderId,
            opened: false,
            seen: false,
            text: generateNotificationText(
              pro?.projectName || "",
              com?.companyName || "",
              ctx.session.user.username || "",
            ),
            userId: input.userReviewId,
          },
        });
        notficationText = generateNotificationText(
          pro?.projectName || "",
          com?.companyName || "",
          ctx.session.user.username || "",
        );
      } else {
        await ctx.db.notification.deleteMany({
          where: {
            purchaseOrderId: po.purchaseOrderId,
            userId: input.userReviewId,
            seen: false,
          },
        });
      }
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
      return { po, notficationText };
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
