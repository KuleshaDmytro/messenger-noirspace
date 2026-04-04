import { useLazyQuery } from "@apollo/client";
import { GET_OR_CREATE_DIRECT_CONVERSATION } from "../api/conversation.queries";

type Resp = {
  getOrCreateDirectConversation: { id: string; createdAt: string };
};

type Vars = { friendId: string };

export function useDirectConversation() {
  const [openConversation, { loading, error, data }] = useLazyQuery<Resp, Vars>(
    GET_OR_CREATE_DIRECT_CONVERSATION,
    {
      fetchPolicy: "network-only",
    }
  );

  const conversationId = data?.getOrCreateDirectConversation.id;

  return {
    openConversation,
    conversationId,
    loading,
    error,
  };
}