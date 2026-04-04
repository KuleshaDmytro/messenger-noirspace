import { GET_MESSAGES } from "@/app/features/conversation/api/getMessages";
import { Message } from "@/app/features/conversation/hooks/useSendMessage";
import { ApolloCache, gql } from "@apollo/client";

export const addMessageToCache = (
    cache: ApolloCache<any>,
    conversationId: string,
    newMessage: Message
) => {
    cache.updateQuery(
        {
            query: GET_MESSAGES,
            variables: { conversationId, take: 20 },
        },
        (cachedData) => {
            if (!cachedData) return cachedData;

            const alreadyExists = cachedData.messages.items.some(
                (m: Message) => m.id === newMessage.id
            );
            if (alreadyExists) return cachedData;

            return {
                ...cachedData,
                messages: {
                    ...cachedData.messages,
                    items: [...cachedData.messages.items, newMessage],
                },
            };
        }
    );
};