'use client'
import { Box, Paper } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { Message } from "./hooks/useSendMessage";

import { useScrollPosition } from "./hooks/useScrollPosition";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { useParams } from "next/navigation";

type ConversationPaperProps = {
    messages: Message[];
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    children: React.ReactNode;
}

export const ConversationPaper = ({ messages, loading, hasMore, loadMore, children }: ConversationPaperProps) => {

    const { id } = useParams();
    const conversationId = id as string;

    const containerRef = useRef<HTMLDivElement>(null!);
    const { topRef } = useInfiniteScroll(hasMore, loading, loadMore, containerRef);
    const { savePosition, restorePosition } = useScrollPosition(conversationId, containerRef);
    const { handleScroll: handleAutoScroll } = useAutoScroll(messages, containerRef);

    const handleScroll = useCallback(() => {
        savePosition();
        handleAutoScroll();
    }, [savePosition, handleAutoScroll]);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (!loading && messages.length > 0 && isFirstLoad.current) {
            isFirstLoad.current = false;
            restorePosition();
        }
    }, [loading, messages.length]);
    
  return (
    <>
        <Paper
            ref={containerRef}
            onScroll={handleScroll}
            elevation={0}
            sx={{
                bgcolor: 'transparent',
                overflow: 'auto',
                padding: '1% 25%',
                flex: 1,
                minHeight: 0,
            }}
        >
            <Box ref={topRef} style={{ height: 1 }} />
            {children}
        </Paper>

    </>
  )
};