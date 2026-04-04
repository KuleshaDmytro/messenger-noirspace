import { useTypedMutation } from "@/app/hooks/useTypedMutation";
import { SEND_MESSAGE } from "../api/sendMessage";
import { addMessageToCache } from "@/app/lib/apollo/chatCacheHelpers";
import { useSession } from "next-auth/react";

export type Message = {
  id: string;
  senderId: string;
  conversationId: string;
  text: string;
  createdAt: string;
};

type SendMessageData = {
  sendMessage: Message;
};

type OptimisticSendMessage = {
  sendMessage: Message & 
    { __typename: 'Message' };
};

type SendMessageVars = {
  conversationId: string;
  text: string;
};

export const useSendMessage = (conversationId: string) => {
  const session = useSession();
  const userId = session.data?.user.id;
  
  const [mutate, { loading, error }] =
    useTypedMutation<SendMessageData, SendMessageVars>(SEND_MESSAGE);

  const sendMessage = (text: string) => {
    if (!conversationId) throw new Error("conversationId is required");
    if (!userId) throw new Error("userId is required");

    const optimistic: OptimisticSendMessage = {
        sendMessage: {
            __typename: 'Message',
            id: `temp-${Date.now()}`,
            text,
            conversationId,
            senderId: userId ?? '',
            createdAt: new Date().toISOString(),
        }
    };

    return mutate({
        variables: { conversationId, text },
        optimisticResponse: optimistic,
        update(cache, { data }) {
            if (!data?.sendMessage) return;
            addMessageToCache(cache, conversationId, data.sendMessage);
        }
    });
  };

  return { sendMessage, loading, error };
};