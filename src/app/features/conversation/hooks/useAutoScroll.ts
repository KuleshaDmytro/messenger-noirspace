import { useRef, useCallback, useEffect } from "react";
import { Message } from "./useSendMessage";

export const useAutoScroll = (
    messages: Message[],
    containerRef: React.RefObject<HTMLDivElement>
) => {
    const isAtBottom = useRef(true);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const threshold = 50;
        isAtBottom.current =
            container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    }, [containerRef]);

    useEffect(() => {
        if (!isAtBottom.current) return;

        requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container) return;
            container.scrollTop = container.scrollHeight;
        });
    }, [messages]);

    return { handleScroll };
};