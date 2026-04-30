import { withFilter } from "graphql-subscriptions";
import { prisma } from "../../app/lib/prisma";
import { Context } from "../context";
import { pubsub } from "../lib/pubsub";
import { requireAuth } from "../lib/guards";

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
      take: number = 20 
  ) => {
      const session = requireAuth(ctx);
      await assertMember(session.id, conversationId);
      
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
    const session = requireAuth(ctx);
    const senderId = session.id;

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
    (_: any, __: any, ctx: Context | undefined) => {
      requireAuth(ctx!);
      return pubsub.asyncIterator(MESSAGE_ADDED);
    },
    async (payload, variables, ctx: Context | undefined) => {
      if (!ctx?.session) return false;

      const member = await prisma.conversationMember.findUnique({
        where: {
          conversationId_userId: {
            conversationId: variables.conversationId,
            userId: ctx.session.id,
          },
        },
      });

      return (
        payload.conversationId === variables.conversationId &&
        member !== null
      );
    }
  );