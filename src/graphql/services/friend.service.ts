import { prisma } from "../../app/lib/prisma";

import { Context } from "../context";
import { FRIEND_ADDED } from "../events";

import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../lib/pubsub";

export const friendService = {
  getFriends: (_: any, {id}: {id: string}, ctx: Context) => {
      if (!ctx.session) throw new Error("Unauthorized");

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
    if (!ctx.session) throw new Error("Unauthorized");
    const userId = ctx.session.id;

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
    () => pubsub.asyncIterator('friendAdded'),
    (payload, variables) => {
      return String(payload.friendAdded.userId) === String(variables.userId);
    }
  );
