import { conversationService } from "../services/conversation.service";
import { Context } from "../context";

export const conversationResolvers = {
  Query: {
    getOrCreateDirectConversation: (_: any, { friendId }: { friendId: string }, ctx: Context) =>
      conversationService.getOrCreateDirect(ctx, friendId),
  },
}; 