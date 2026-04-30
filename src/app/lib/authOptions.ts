import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { createRefreshToken, rotateRefreshToken, signAccessToken } from "./auth/jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        const refreshToken = await createRefreshToken(user.id);

        return {
          id: user.id,
          email: user.email,
          nickName: user.nickName,
          refreshToken,
        };
      },
    }),
  ],

  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          nickName: user.nickName,
          refreshToken: user.refreshToken,
          accessToken: signAccessToken(user.id),
          accessTokenExpiry: Date.now() + 14 * 60 * 1000,
        };
      }

      if (Date.now() < (token.accessTokenExpiry as number)) {
        return token;
      }

      try {
        const { accessToken, refreshToken, userId } = await rotateRefreshToken(
          token.refreshToken as string
        );
    console.log("✅ Rotated successfully");

        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpiry: Date.now() + 14 * 60 * 1000,
          error: undefined,
        };
      } catch(e) {
        return { ...token, error: "RefreshTokenError" };
      }
    },

    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id as string;
      session.user.nickName = token.nickName as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
};