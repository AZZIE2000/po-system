import { registerSchema, updateUserSchema } from "@/validation/auth";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const SALT_ROUNDS = 10;

export const authRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      include: {
        role: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const result = await ctx.db.user.delete({
        where: {
          id,
        },
      });
      return result;
    }),
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, roleId, id } = input;
      const result = await ctx.db.user.update({
        where: {
          id,
        },
        data: {
          username,
          roleId,
        },
      });
      return result;
    }),
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, email, password, roleId } = input;

      const exists = await ctx.db.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);

      const result = await ctx.db.user.create({
        data: {
          username,
          email,
          password: hash,
          roleId: roleId,
        },
      });
      console.log(result);

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
});
