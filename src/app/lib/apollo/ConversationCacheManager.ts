import { CacheConfig, ConversationMeta } from "@/app/features/conversation/types/conversation";

const CONFIG: CacheConfig = {
  MAX_CACHED_CHATS: 10,
  MAX_MESSAGES_PER_CHAT: 50,
  EVICT_AFTER_INACTIVE_MS: 5 * 60 * 1000,
};

class ConversationCacheManager {
  private chatAccess = new Map<string, ConversationMeta>();
  private activeChat: string | null = null;

  setActiveChat(chatId: string): void {
    this.activeChat = chatId;
    this.chatAccess.set(chatId, {
      timestamp: Date.now(),
      messageCount: this.chatAccess.get(chatId)?.messageCount ?? 0,
    });
  }

  getChatsToEvict(): string[] {
    const toEvict = new Set<string>();
    const now = Date.now();

    // Евіктуємо по часу неактивності
    for (const [id, meta] of this.chatAccess) {
      const isInactive = now - meta.timestamp > CONFIG.EVICT_AFTER_INACTIVE_MS;
      const isNotActive = id !== this.activeChat;

      if (isInactive && isNotActive) {
        toEvict.add(id);
      }
    }

    // Евіктуємо по перевищенню ліміту
    if (this.chatAccess.size > CONFIG.MAX_CACHED_CHATS) {
      const overflow = this.chatAccess.size - CONFIG.MAX_CACHED_CHATS;

      [...this.chatAccess.entries()]
        .filter(([id]) => id !== this.activeChat)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, overflow)
        .forEach(([id]) => toEvict.add(id));
    }

    return [...toEvict];
  }

  onChatEvicted(chatId: string): void {
    this.chatAccess.delete(chatId);
  }

  getActiveChat(): string | null {
    return this.activeChat;
  }
}

export const cacheManager = new ConversationCacheManager();