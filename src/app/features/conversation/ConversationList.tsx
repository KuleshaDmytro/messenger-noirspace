import React from 'react';
import Message from './Message';
import { Box } from '@mui/material';
import { ConversationListProps } from './types/conversationList';

const ConversationList: React.FC<ConversationListProps> = ({ 
  messages, 
  userId,
  virtualizer,
}) => {

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Box
      style={{
        height: virtualizer.getTotalSize(),
        position: 'relative',
        width: '100%',
      }}
    >
      {virtualItems.map((virtualItem) => {
        const msg = messages[virtualItem.index];
        return (
          <Box
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              width: '100%',
              left: 0,
              right: 0,
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            <Message
              text={msg.text}
              isMine={msg.senderId === userId}
              createdAt={msg.createdAt}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default ConversationList;