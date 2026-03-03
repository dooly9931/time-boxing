import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn({ user }) {
      const allowed = process.env.ALLOWED_EMAILS;
      if (!allowed) return true;
      const list = allowed.split(",").map((e) => e.trim().toLowerCase());
      return !!user.email && list.includes(user.email.toLowerCase());
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
