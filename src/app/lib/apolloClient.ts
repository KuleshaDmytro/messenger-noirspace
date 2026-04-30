import { ApolloClient, HttpLink, split, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { cache } from "./apollo/cache";
import { getValidToken } from "./auth/getValidToken";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("accessToken");
}

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: "include",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

const wsClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_SUB_URL!,
  lazy: true,

  connectionParams: async () => {
    const token = await getValidToken();
    return token ? { authorization: `Bearer ${token}` } : {};
  },

  shouldRetry: (errOrCloseEvent) => {
    if (errOrCloseEvent instanceof CloseEvent) {
      if ([4400, 4401, 4403].includes(errOrCloseEvent.code)) {
        console.log(`ERROR: WS connection closed with code ${errOrCloseEvent.code}. Not retrying.`);
        
        return false;
      }
    }
    return true;
  },
  retryAttempts: 3,
  retryWait: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  on: {
    connected: () => console.log("✅ WS connected"),
    closed: () => console.log("🔌 WS closed"),
    error: (err) => console.error("❌ WS error", err),
    connecting: () => console.log("🔄 WS connecting..."),
  },
});

const wsLink = new GraphQLWsLink(wsClient);

const link = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === "OperationDefinition" && def.operation === "subscription";
  },
  wsLink,
  ApolloLink.from([authLink, httpLink]),
);

const client = new ApolloClient({
  link,
  cache,
});

export default client;