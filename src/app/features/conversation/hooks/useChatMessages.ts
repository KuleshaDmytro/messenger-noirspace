import { useGetMessages } from "./useGetMessages";
import { useMessageSubscription } from "./useMessageSubscription";

export const useChatMessages = (conversationId: string) => {
  const { messages, loading, error, hasMore, loadMore } = 
    useGetMessages(conversationId);

  useMessageSubscription(conversationId);

  return { messages, loading, error, hasMore, loadMore };
};