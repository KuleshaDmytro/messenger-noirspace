import { Context } from "../context";
import { pubsub } from "../lib/pubsub";
import { createMessageAddedSubscription, messageService } from "../services/message.service";
import { withFilter } from "graphql-subscriptions";

const MESSAGE_ADDED = "MESSAGE_ADDED";
const TAKE = 20; 

export const messageResolvers = {
  Query: {
    messages: (_: any,  { conversationId, cursor, take }: { conversationId: string; cursor?: string; take?: number }, ctx: Context ) =>
      messageService.getAll(ctx, conversationId, cursor, take),
  },
  
  Mutation: {
    sendMessage: (_: any, { conversationId, text }: { conversationId: string; text: string }, ctx: Context) =>
      messageService.send(ctx, conversationId, text),
  },

  Subscription: {
    messageAdded: {
      subscribe: createMessageAddedSubscription(),
    },
  }
};