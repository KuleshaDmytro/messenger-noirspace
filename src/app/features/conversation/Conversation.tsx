import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ConversationList from './ConversationList';
import MessageInput from './MessageInput';

const Conversation: React.FC = () => {

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ px: 2, height: '100%' }}
        >
            <Paper
            elevation={0}
            sx={{
                p: 2,
                bgcolor: 'transparent',
                width: '100%',
                maxWidth: 800,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
            >
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto' }}>
                <ConversationList />
            </Box>

            <MessageInput />

            </Paper>
        </Box>
    );
};

export default Conversation;