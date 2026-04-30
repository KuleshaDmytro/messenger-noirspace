import { prisma } from "../../app/lib/prisma";

import { Context } from "../context";

import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../lib/pubsub";
import { requireAuth } from "../lib/guards";

export const friendService = {
  getFriends: (_: any, {id}: {id: string}, ctx: Context) => {
    requireAuth(ctx);

    const friends = prisma.friend.findMany({
          where: { userId: id },
          include: { 
            friend: true 
          },
          orderBy: { createdAt: "desc" },
        });
    return friends;
  },

  deleteFriend: async (_: any, {friendId}: {friendId: string}, ctx: Context) => {
    const session = requireAuth(ctx);
    const userId = session.id;

    const result = await prisma.friend.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });


    return result.count > 0;
  },

  notifyFriendAdded: async (userBId: string, userAId: string, friendB: any, friendA: any) => {

    await pubsub.publish('friendAdded', {
      friendAdded: {
        userId: userAId,
        friend: friendA,
      },
    });

    await pubsub.publish('friendAdded', {
      friendAdded: {
        userId: userBId,
        friend: friendB,
      },
    });

  },
}

export const createFriendAddedSubscription = () =>
  withFilter(
    (_: any, __: any, ctx: Context | undefined) => {
      requireAuth(ctx);
      return pubsub.asyncIterator("friendAdded");
    },
    (payload, variables, ctx: Context | undefined) => {
      if (!ctx?.session) return false;

      return (
        String(payload.friendAdded.userId) === String(variables.userId) &&
        String(variables.userId) === String(ctx.session.id)
      );
    }
  );