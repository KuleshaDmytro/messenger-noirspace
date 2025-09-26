import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          nickName: user.nickName
        };
      }
    })
  ],

  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user } : { token: any; user: any }) {
      // при логіні додаємо дані з user у токен
      if (user) {
        token.id = user.id;
        token.nickName = user.nickName;
      }
      return token;
    },
    async session({ session, token } : { session: any; token: any }) {
      // при формуванні сесії додаємо дані з токена
      if (token) {
        session.user.id = token.id as string;
        session.user.nickName = token.nickName as string;
      }
      return session;
    }
  }
};
