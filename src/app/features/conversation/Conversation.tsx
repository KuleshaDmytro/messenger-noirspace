'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, LinearProgress, Paper } from '@mui/material';
import ConversationList from './ConversationList';
import MessageInput from './MessageInput';
import { useParams } from 'next/navigation';
import { useChatMessages } from './hooks/useChatMessages';
import { useSession } from 'next-auth/react';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useError } from '@/app/hooks/useError';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useChatScrollAnchor } from './hooks/useChatScrollAnchor';

const ERROR_MSG = "Failed to load messages. Please try again.";

const Conversation: React.FC = () => {  
    
    const { data: session, status } = useSession();
    const userId = session?.user.id;

    const { id } = useParams();
    const conversationId = id as string;
    const containerRef = useRef<HTMLDivElement>(null!);

    const { messages, loading, error, hasMore, loadMore } = useChatMessages(conversationId);

    const { showError } = useError();
    useEffect(() => {
        if (error) {
            showError(error, ERROR_MSG);
        }
    }, [error]);

    const estimateSize = useCallback(
        (index: number) => {
            const lines = Math.ceil(messages[index].text.length / 60);
            return 48 + lines * 20;
        },
        [messages]
    );
    
    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => containerRef.current,
        estimateSize,
        overscan: 5,
    });
    
    const { savePosition, restorePosition } = useChatScrollAnchor({
        virtualizer,
        messages,
        getId: (msg) => msg.id,
        conversationId,
    })
    
   useInfiniteScroll({
        hasMore,
        loading,
        virtualizer,
        messages,
        loadMore,
        getId: (msg) => msg.id,
    })

    const [isRestored, setIsRestored] = useState(false);
    const totalSize = virtualizer.getTotalSize();
    const hasRestoredRef = useRef(false);

    const handleScroll = useCallback(() => {
        savePosition()
    }, [savePosition])

    useEffect(() => {
        if (!loading && messages.length > 0 && totalSize > 0 && !hasRestoredRef.current) {
            hasRestoredRef.current = true;
            const restore = async () => {
                await restorePosition();
                setIsRestored(true);
            };
            restore();
        }
    }, [loading, messages.length, totalSize]);

    if (status === "loading") return <LinearProgress />;

    return (            
        <Box
            display="flex"
            flexDirection="column"
            justifyContent='flex-end'
            sx={{
                minWidth: '250px',
                width: '100%',
                height: '95dvh',
                overflow: 'hidden',
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                sx={{                
                    overflow: 'hidden',
                }}
            >

                <Paper
                    ref={containerRef}
                    onScroll={handleScroll}
                    elevation={0}
                    sx={{
                        bgcolor: 'transparent',
                        overflow: isRestored ? 'auto' : 'hidden', // блокуємо скрол під час відновлення
                        padding: '1% 25%',
                        height: '100%',
                        flex: 1,
                        minWidth: '250px',
                        minHeight: 0,
                        visibility: isRestored ? 'visible' : 'hidden', // ховаємо до відновлення
                    }}
                >
                    {!loading &&
                        <ConversationList messages={messages} userId={userId} virtualizer={virtualizer} />
                    }
                </Paper>

                <Box sx={{ px: '25%' }}>
                    <MessageInput />
                </Box>
            </Box>
        </Box>
    );
};

export default Conversation;