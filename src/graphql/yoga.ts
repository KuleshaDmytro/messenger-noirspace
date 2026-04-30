import { createYoga } from "graphql-yoga";
import { createContext } from "./context";
import { schema } from "./schema/index";

export const config = {
  api: { bodyParser: false },
};

export const yoga = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: process.env.API_GRAPHQL_URL ?? "/api/graphql",
  graphiql: {
      subscriptionsProtocol: "WS",
  },
  fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST };
