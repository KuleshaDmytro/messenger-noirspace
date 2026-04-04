import { useApolloClient, useSubscription } from "@apollo/client";
import { MESSAGE_ADDED } from "../api/mesageAdded";
import { addMessageToCache } from "@/app/lib/apollo/chatCacheHelpers";

export const useMessageSubscription = (conversationId: string) => {
  const client = useApolloClient();

  useSubscription(MESSAGE_ADDED, {
    variables: { conversationId },
    skip: !conversationId,
    onData: ({ data }) => {
      addMessageToCache(client.cache, conversationId, data.data.messageAdded);
    }
  });
};