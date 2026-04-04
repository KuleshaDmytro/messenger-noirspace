// import { createServer } from "http";
// import { WebSocketServer } from "ws";
// import { useServer } from 'graphql-ws/use/ws';
// import { schema } from "./src/graphql/schema";
// import { createContext } from "./src/graphql/context";

// const PORT = 4000;

// const server = createServer();
// const wsServer = new WebSocketServer ({
//     server,
//     path: "/graphql"
// })

// useServer({ schema, context: createContext }, wsServer);
// console.log("🧠 useServer initialized for /graphql");

// server.listen(PORT, () => {
//   console.log(`✅ WS Server running at ws://localhost:${PORT}/graphql`);
// });


import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { schema } from "./src/graphql/schema/index";
import { GraphQLSchema } from "graphql";
import { pubsub } from "./src/graphql/lib/pubsub";

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
    context: () => ({
      pubsub,
    }),

    onNext: (ctx, msg, args, result) => {
      console.log("📨 onNext", result);
    },
    onSubscribe: (ctx, msg) => {
      console.log("📩 Subscription request", msg);
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

console.log("WS", schema.getSubscriptionType()?.getFields());


server.listen(PORT, () => {
  console.log(`✅ WS Server ready at ws://localhost:${PORT}/graphql`);
});