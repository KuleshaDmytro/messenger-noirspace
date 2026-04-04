import { withFilter } from "graphql-subscriptions";
import { prisma } from "../../app/lib/prisma";
import { Context } from "../context";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { pubsub } from "../lib/pubsub";

const MESSAGE_ADDED = "MESSAGE_ADDED";

async function assertMember(userId: string, conversationId: string) {
  const member = await prisma.conversationMember.findFirst({
    where: { userId, conversationId },
  });
  if (!member) throw new Error("Access denied");
}

export const messageService = {
  getAll: async (
      ctx: Context,
      conversationId: string,
      cursor?: string, 
      take: number = 20 // Default value for take
  ) => {
      if (!ctx.session) throw new UnauthorizedError();
      await assertMember(ctx.session.id, conversationId);

      const messages = await prisma.message.findMany({
          where: { conversationId },
          take: take + 1,
          orderBy: { createdAt: 'desc' },
          ...(cursor && {
              cursor: { id: cursor },
              skip: 1,
          }),
      });

      const hasMore = messages.length > take;
      if (hasMore) messages.pop();

      return {
          items: messages.reverse(),
          nextCursor: hasMore ? messages[0].id : null,
          hasMore,
      };
  },

  send: async (ctx: Context, conversationId: string, text: string) => {
    if (!ctx.session) throw new UnauthorizedError();
    const senderId = ctx.session.id;

    await assertMember(senderId, conversationId);

    const message = await prisma.message.create({
      data: { senderId, conversationId, text },
    });

    await pubsub.publish(MESSAGE_ADDED, {
      messageAdded: message,
      conversationId,
    });

    return message;
  },
};

export const createMessageAddedSubscription = () =>
  withFilter(
    () => pubsub.asyncIterator(MESSAGE_ADDED),
    (payload, variables) => {
      return payload.conversationId === variables.conversationId;
    }
  );