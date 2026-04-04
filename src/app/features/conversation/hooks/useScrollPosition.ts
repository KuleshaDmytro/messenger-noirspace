import { useCallback } from "react";

export const useScrollPosition = (
    conversationId: string,
    containerRef: React.RefObject<HTMLDivElement>
) => {
    const savePosition = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        sessionStorage.setItem(
            `scroll:${conversationId}`,
            String(container.scrollTop)
        );
    }, [conversationId, containerRef]);

    const restorePosition = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const saved = sessionStorage.getItem(`scroll:${conversationId}`);

        if (saved) {
            container.scrollTop = Number(saved);
        } else {
            container.scrollTop = container.scrollHeight;
        }
    }, [conversationId, containerRef]);

    return { savePosition, restorePosition };
};