import { cacheManager } from '@/app/lib/apollo/ConversationCacheManager';
import { useApolloClient } from '@apollo/client';
import { useCallback, useEffect, useRef } from 'react';

const EVICT_INTERVAL_MS = 2 * 60 * 1000;

export function useChatCache() {
  const client = useApolloClient();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const evictConversation = useCallback(
        (chatIds: string[]): void => {
            chatIds.forEach((chatId) => {

            client.cache.evict({
                id: "ROOT_QUERY",
                fieldName: "messages",
                args: { conversationId: chatId },
            });

            cacheManager.onChatEvicted(chatId);
            });

            client.cache.gc();
        },
        [client]
    );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const toEvict = cacheManager.getChatsToEvict();
      if (toEvict.length > 0) evictConversation(toEvict);
    }, EVICT_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [evictConversation]);

  const openChat = useCallback(
    (chatId: string): void => {
      const toEvict = cacheManager.getChatsToEvict();
      if (toEvict.length > 0) evictConversation(toEvict);

      cacheManager.setActiveChat(chatId);
    },
    [evictConversation]
  );

  return { openChat };
}