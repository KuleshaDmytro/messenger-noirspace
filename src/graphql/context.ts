// src/server/context.ts
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession, Session } from "next-auth";
import { getToken } from "next-auth/jwt";
import { pubsub } from "./lib/pubsub";

export interface Context {
  session: { id: string; nickName: string } | null;
  pubsub: any;
//   request: Request;
}

export async function createContext({ request }: { request: Request }): Promise<Context> {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const session = token
    ? { id: token.sub!, nickName: token.email! }
    : null;

  return { 
    session,
    pubsub
  };
}