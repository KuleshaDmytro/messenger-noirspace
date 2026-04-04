import { useEffect, useRef } from "react";
import { useScrollAnchor } from "./useScrollAnchor";

export const useInfiniteScroll = (
    hasMore: boolean,
    loading: boolean,
    loadMore: () => void,
    containerRef: React.RefObject<HTMLDivElement>,
) => {
    const topRef = useRef<HTMLDivElement>(null);
    const { captureAnchor, restoreAnchor } = useScrollAnchor(containerRef);
    const isInitialized = useRef(false);
    const isLoadingMore = useRef(false);

    useEffect(() => {
        if (isLoadingMore.current && !loading) {
            restoreAnchor();
            isLoadingMore.current = false;
        }
    }, [loading]);

    useEffect(() => {
        if (!topRef.current || !containerRef.current) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                const first = entries[0];
                if (!first.isIntersecting || !hasMore || loading) return;

                // if (!isInitialized.current) {
                //     isInitialized.current = true;
                //     return;
                // }

                if (isLoadingMore.current) return;

                captureAnchor();
                isLoadingMore.current = true;
                loadMore(); // без await — loading стан відстежуємо через useEffect
            },
            {
                root: containerRef.current,
                rootMargin: '100px 0px 0px 0px',
                threshold: 0,
            }
        );

        observer.observe(topRef.current);
        return () => observer.disconnect();

    }, [hasMore, loading, loadMore, captureAnchor]);

    return { topRef };
};