import { ApolloClient, HttpLink, split, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { cache } from './apollo/cache';

const httpLink = new HttpLink ({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: "include",
})
const wsClient = createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_SUB_URL!,
    on: {
      connected: () => console.log("✅ WS connected"),
      closed: () => console.log("🔌 WS closed"),
      error: (err) => console.error("❌ WS error", err),
    },
})
const wsLink = new GraphQLWsLink(wsClient) 

const link = split(
  ({query}) => {
    const def = getMainDefinition(query);
    return def.kind === "OperationDefinition" && def.operation === "subscription";
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link,
  cache,
});

export default client;
