export interface ConversationMeta {
  timestamp: number;
  messageCount: number;
}

export interface CacheConfig {
  MAX_CACHED_CHATS: number;
  MAX_MESSAGES_PER_CHAT: number;
  EVICT_AFTER_INACTIVE_MS: number;
}

export interface EvictOptions {
  chatId: string;
}