'use client'
import React, { useCallback, useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import ConversationList from './ConversationList';
import MessageInput from './MessageInput';
import { useParams } from 'next/navigation';
import { useChatMessages } from './hooks/useChatMessages';
import { useSession } from 'next-auth/react';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useScrollPosition } from './hooks/useScrollPosition';
import { useAutoScroll } from './hooks/useAutoScroll';

const Conversation: React.FC = () => {  
    
    const userId = useSession().data?.user.id;
    const { id } = useParams();
    const conversationId = id as string;
    const containerRef = useRef<HTMLDivElement>(null!);

    const { messages, loading, error, hasMore, loadMore } = useChatMessages(conversationId);

    const { savePosition, restorePosition } = useScrollPosition(conversationId, containerRef);
    const { topRef } = useInfiniteScroll(hasMore, loading, loadMore, containerRef);
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
                justifyContent="flex-end"
                sx={{                
                    overflow: 'auto',
                }}
            >
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
                
                    {!loading &&
                        <ConversationList messages={messages} userId={userId} />
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