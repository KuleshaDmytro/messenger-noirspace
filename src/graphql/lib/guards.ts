import { Context } from "../context";
import { GraphQLError } from "graphql";

type AuthResult = { id: string; nickName: string };

export function requireAuth(ctx: Context | undefined): AuthResult {

  if (!ctx?.session) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
  return ctx.session;
}