import NextAuth, {
  DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// import { env } from "../../../env/server.mjs";
// import { prisma } from "";
import { loginSchema } from "@/validation/auth";
import { db as Prisma } from "@/server/db";
import { env } from "@/env";
// import { authOptions } from "@/server/auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      email: string;

      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const dbUser = await Prisma.user.findFirst({ where: { id: user.id } });
        token.id = user.id;
        token.email = user.email;
        token.username = dbUser?.username;
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.username as string;
      }

      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("creds +++++++++++++++", credentials);
        const cred = await loginSchema.parseAsync(credentials); // for validation
        console.log("creds +++++++++++++++", cred);

        const user = await Prisma.user.findFirst({
          where: { email: cred.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = bcrypt.compareSync(
          cred.password,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
