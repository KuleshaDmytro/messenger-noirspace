import { useTypedQuery } from "@/app/hooks/useTypedQuery";
import { GET_MESSAGES } from "../api/getMessages";

type Message = {
  id: string;
  senderId: string;
  conversationId: string;
  text: string;
  messages: Message[];
  items: Message[];
  createdAt: string;
  hasMore?: boolean;
  nextCursor?: string;
};

type MessagesData = {
  messages: Message;
  items: Message[];
  hasMore: boolean;
  nextCursor: string | null;
};

type MessagesVars = {
  conversationId: string;
  cursor?: string;
  take: number;
};

export const useGetMessages = (conversationId: string) => {
  const { data, loading, error, fetchMore } =
    useTypedQuery<MessagesData, MessagesVars>(
      GET_MESSAGES,
      {
        variables: { conversationId, take: 20 },
        skip: !conversationId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      }
    );

  const loadMore = () => {
    if (!data?.messages.hasMore) return;

    fetchMore({
        variables: {
            conversationId,
            cursor: data.messages.nextCursor,
            take: 20,
        },
    });
  };

  return {
    messages: data?.messages.items ?? [],
    hasMore: data?.messages.hasMore ?? false,
    loading,
    error,
    loadMore,
  };
};