import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const notificationRouter = createTRPCRouter({
  getUnseenCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.count({
      where: {
        userId: ctx.session.user.id,
        seen: false,
      },
    });
  }),
  getLastTen: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAllInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, skip } = input;
      const notifications = await ctx.db.notification.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor
          ? {
              notificationId: cursor,
            }
          : undefined,
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (notifications.length > limit) {
        const nextItem = notifications.pop();
        nextCursor = nextItem?.notificationId;
      }
      return {
        notifications,
        nextCursor,
      };
    }),
  markAllAsSeen: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
        seen: false,
      },
      data: {
        seen: true,
      },
    });
  }),
  markAsOpened: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notification.update({
        where: {
          notificationId: input.notificationId,
        },
        data: {
          opened: true,
          seen: true,
        },
      });
    }),
});
