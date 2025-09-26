import { Context } from "../context";
import { messageService } from "../services/message.service";

export const messageResolvers = {
  Query: {
    messages: (_: any, __: any, ctx: Context) => messageService.getAll(ctx),
  },
  Mutation: {
    sendMessage: (_: any, { senderId, recipientId, text }: { senderId: string; recipientId: string; text: string }, ctx: Context) =>
      messageService.send(ctx, senderId, recipientId, text),
  },
};
