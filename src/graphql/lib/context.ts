import { pubsub } from "./pubsub";

export async function createWsContext(ctx: any) {

  const session = ctx.connectionParams?.session ?? null;

  return {
    pubsub,
    session,
  };
}
