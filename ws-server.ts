import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { schema } from "./src/graphql/schema/index";
import { GraphQLError, GraphQLSchema } from "graphql";
import { pubsub } from "./src/graphql/lib/pubsub";
import { verifyAccessToken } from "./src/app/lib/auth/jwt";

console.log("WS schema instance:", schema instanceof GraphQLSchema);
console.log("WS schema constructor:", schema.constructor.name);

const PORT = 4000;

const server = createServer();
const wsServer = new WebSocketServer({
  server,
  path: "/graphql",
});

useServer(
  {
    schema,

    onConnect: async (ctx) => {
      const authHeader = ctx.connectionParams?.authorization as string | undefined;

      if (!authHeader?.startsWith("Bearer ")) {
        return false;
      }

      try {
        const token = authHeader.slice(7);
        const payload = verifyAccessToken(token);

        (ctx.extra as any).userId = payload.sub;
        (ctx.extra as any).nickName = payload.nickName;

        console.log("✅ WS connected:", payload.sub);
      } catch (err) {
        return false;
      }
    },

    context: (ctx) => ({
      session: {
        id: (ctx.extra as any).userId,
        nickName: (ctx.extra as any).nickName,
      },
      pubsub,
    }),

    onNext: (ctx, msg, args, result) => {
      console.log("📨 onNext", result);
    },
    onSubscribe: (ctx, msg) => {

      const userId = (ctx.extra as any).userId;
      if (!userId) {
        return [new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        })];
      }
    },
    onOperation: (ctx, msg, args, result) => {
      console.log("⚙️ onOperation", { args, result });
    },
    onError: (ctx, msg, errors) => {
      console.error("🔥 WS ERROR!", errors);
    },
    onComplete: () => {
      console.log("🔚 Subscription completed");
    },
  },
  wsServer
);

server.listen(PORT, () => {
  console.log(`✅ WS Server ready at ws://localhost:${PORT}/graphql`);
});