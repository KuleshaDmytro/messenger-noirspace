import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { createContext } from "./context";

export const config = {
  api: { bodyParser: false },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: createContext,
  graphqlEndpoint: process.env.API_GRAPHQL_URL ?? "/api/graphql",
  graphiql: true,
  fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST };
