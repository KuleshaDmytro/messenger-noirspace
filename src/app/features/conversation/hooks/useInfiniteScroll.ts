import { Virtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { Message } from "./useSendMessage";

type UseInfiniteScrollParams = {
    hasMore: boolean;
    loading: boolean;
    virtualizer: Virtualizer<HTMLDivElement, Element>;
    messages: Message[];
    loadMore: () => void;
    getId: (msg: Message) => string;
};

export const useInfiniteScroll = ({
    hasMore,
    loading,
    virtualizer,
    messages,
    loadMore,
    getId,
}: UseInfiniteScrollParams) => {
    const anchorRef = useRef<{ id: string; offset: number } | null>(null);
    const wasLoadingRef = useRef(false);
    const userHasScrolledRef = useRef(false);

    useEffect(() => {
        const el = virtualizer.scrollElement;
        if (!el) return;

        const handleScroll = () => {
            userHasScrolledRef.current = true;
        };

        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, [virtualizer.scrollElement]);

    const virtualItems = virtualizer.getVirtualItems();
    const firstVisibleIndex = virtualItems[0]?.index === 0;

    useEffect(() => {
        if (firstVisibleIndex && hasMore && !loading && userHasScrolledRef.current) {
            const firstVirtualItem = virtualItems[0];
            const firstItem = messages[firstVirtualItem?.index];
            
            if (firstItem) {
                anchorRef.current = {
                    id: getId(firstItem),
                    offset: firstVirtualItem.start - (virtualizer.scrollOffset ?? 0),
                };
            }
            loadMore();
        }
    }, [firstVisibleIndex, hasMore, loading]);

    useEffect(() => {
        if (wasLoadingRef.current && !loading && anchorRef.current) {
            const index = messages.findIndex(m => getId(m) === anchorRef.current!.id);
            
            if (index !== -1) {
                virtualizer.scrollToIndex(index, { align: 'start' });
                
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    const currentOffset = virtualizer.scrollOffset ?? 0;
                    virtualizer.scrollToOffset(currentOffset + anchorRef.current!.offset);
                    anchorRef.current = null;
                }));
            }
        }
        wasLoadingRef.current = loading;
    }, [loading, messages]);
};

