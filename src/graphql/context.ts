import { getToken } from "next-auth/jwt";
import { pubsub } from "./lib/pubsub";
import { verifyAccessToken } from "@/app/lib/auth/jwt";

export interface Context {
  session: { id: string; nickName: string } | null;
  pubsub: typeof pubsub;
}

export async function createContext({
  request,
}: {
  request: Request;
}): Promise<Context> {
  // ─── HTTP (GraphQL Yoga) ───────────────────────────────
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const payload = verifyAccessToken(token);

      return {
        session: { id: payload.sub!, nickName: payload.nickName as string },
        pubsub,
      };
    } catch {
    }
  }

  // ─── Fallback: next-auth ───────
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const session = token
    ? { id: token.sub!, nickName: token.nickName as string }
    : null;

  return { session, pubsub };
}