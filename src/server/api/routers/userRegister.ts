import { registerSchema } from "@/validation/auth";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { publicProcedure, createTRPCRouter } from "../trpc";

const SALT_ROUNDS = 10;

// import { router, publicProcedure } from "@/trpc";

export const authRouter = createTRPCRouter({
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
          roleId: roleId || "cm3akl3ab0000mmiqtjg9xuot",
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
});
