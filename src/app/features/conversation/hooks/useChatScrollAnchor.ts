import { Virtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

type UseChatScrollAnchorParams<T> = {
  virtualizer: Virtualizer<any, any>;
  messages: T[];
  getId: (item: T) => string;
  conversationId: string;
};

export type Anchor = {
  id: string;
  offsetFromTop: number;
};

type UseChatScrollAnchorReturn = {
  savePosition: () => void;
  restorePosition: () => void;
  getAnchor: () => Anchor | null;
};

const STORAGE_KEY = "chat-scroll";

const storage = {
  get(): Record<string, Anchor> {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      return {};
    }
  },
  set(data: Record<string, Anchor>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {
      console.log(e);
      
    }
  },
};

function waitForStableSize(
  virtualizerRef: React.MutableRefObject<Virtualizer<any, any>>,
  maxAttempts = 10,
  intervalMs = 50
): Promise<void> {
  return new Promise((resolve) => {
    let attempts = 0;
    let lastSize = virtualizerRef.current.getTotalSize();

    const check = () => {
      const currentSize = virtualizerRef.current.getTotalSize();

      if (currentSize === lastSize || attempts >= maxAttempts) {
        resolve();
        return;
      }

      lastSize = currentSize;
      attempts++;
      setTimeout(check, intervalMs);
    };

    setTimeout(check, intervalMs);
  });
}

export const useChatScrollAnchor = <T>({
    virtualizer,
    messages,
    getId,
    conversationId,
}: UseChatScrollAnchorParams<T>): UseChatScrollAnchorReturn => {
    const virtualizerRef = useRef(virtualizer);
    virtualizerRef.current = virtualizer;

    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    const getIdRef = useRef(getId);
    getIdRef.current = getId;

    const isRestoringRef = useRef(false);

    const getAnchor = useCallback((): Anchor | null => {
    const v = virtualizerRef.current;
    const virtualItems = v.getVirtualItems();
    const scrollOffset = v.scrollOffset ?? 0;
    
    const firstFullyVisible = virtualItems.find(
          item => item.start >= scrollOffset
      ) ?? virtualItems[0];
      
      if (!firstFullyVisible) return null;
      
      const item = messagesRef.current[firstFullyVisible.index];
      if (!item) return null;

      return {
          id: getIdRef.current(item),
          offsetFromTop: firstFullyVisible.start - scrollOffset,
      };
    }, []);

    const savePosition = useCallback(() => {
      const anchor = getAnchor();
      if (!anchor) return;

      const data = storage.get();
      data[conversationId] = anchor;
      storage.set(data);
    }, [conversationId, getAnchor]);

    const restorePosition = useCallback(async (): Promise<void> => {
      if (isRestoringRef.current) return;
      isRestoringRef.current = true;

      try {
          const anchor = storage.get()[conversationId];

          const v = virtualizerRef.current;
          await waitForStableSize(virtualizerRef);

          if (!anchor) {
              v.scrollToIndex(messagesRef.current.length - 1, { align: 'end' });
              return;
          }

          const msgs = messagesRef.current;
          const index = msgs.findIndex((m) => getIdRef.current(m) === anchor.id);
          if (index === -1) return;

          v.scrollToIndex(index, { align: 'start' });

          await new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          );

          const item = v.getVirtualItems().find(i => i.index === index);
          if (item) {
              v.scrollToOffset(item.start - anchor.offsetFromTop);
          }

      } finally {
          isRestoringRef.current = false;
      }
    }, [conversationId]);

  return { savePosition, restorePosition, getAnchor };
};