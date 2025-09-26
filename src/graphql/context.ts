// src/server/context.ts
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession, Session } from "next-auth";
import { getToken } from "next-auth/jwt";

export interface Context {
  session: { id: string; nickName: string } | null;
//   request: Request;
}

export async function createContext({ request }: { request: Request }): Promise<Context> {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Ти можеш сам сформувати сесію
  const session = token
    ? { id: token.sub!, nickName: token.email! }
    : null;

  return { session };
}