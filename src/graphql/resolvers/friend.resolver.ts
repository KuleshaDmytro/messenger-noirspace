import { Context } from "../context";
import {createFriendAddedSubscription, friendService} from "../services/friend.service";

export const friendResolvers = {
    Query: {
        getFriends: (_: any, {id}: {id: string}, ctx: Context) => friendService.getFriends(_, {id}, ctx),
    },

    Mutation: {
        deleteFriend: (_: any, {friendId}: {friendId: string}, ctx: Context) => friendService.deleteFriend(_, {friendId}, ctx),
    },

    Subscription: {
        friendAdded: {
            subscribe: (parent: any, args: any, ctx: Context) =>
            createFriendAddedSubscription()(parent, args, ctx),
        },
    }
}