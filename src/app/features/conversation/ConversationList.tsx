import React from "react";
import Message from "@/app/features/conversation/Message";

interface MessageType {
  id: string;
  senderId: string;
  text: string;
  conversationId: string;
  createdAt: string;
}

interface ConversationListProps {
  messages: MessageType[];
  userId: string | undefined;
}

const ConversationList: React.FC<ConversationListProps> = ({ messages, userId }) => (
  <>
    {messages.map((msg) => (
      <Message
        key={msg.id}
        text={msg.text}
        isMine={msg.senderId === userId}
        createdAt={msg.createdAt}
      />
    ))}
  </>
);

export default ConversationList;

