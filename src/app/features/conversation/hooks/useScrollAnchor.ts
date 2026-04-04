import { useCallback, useRef } from "react";

export const useScrollAnchor = (
    containerRef: React.RefObject<HTMLDivElement>
) => {
    const prevScrollHeight = useRef<number>(0);

    const captureAnchor = useCallback(() => {
        if (!containerRef.current) return;
        prevScrollHeight.current = containerRef.current.scrollHeight;
    }, [containerRef]);

    const restoreAnchor = useCallback(() => {
        requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container) return;
            container.scrollTop = container.scrollHeight - prevScrollHeight.current;
        });
    }, [containerRef]);

    return { captureAnchor, restoreAnchor };
};