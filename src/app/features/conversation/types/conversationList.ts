import { Virtualizer } from "@tanstack/react-virtual";

export interface MessageType {
  id: string;
  senderId: string;
  text: string;
  conversationId: string;
  createdAt: string;
}

export interface ConversationListProps {
  messages: MessageType[];
  userId: string | undefined;
  virtualizer: Virtualizer<HTMLDivElement, Element>
}
