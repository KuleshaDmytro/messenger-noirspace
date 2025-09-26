import { Context } from "../context";
import {friendRequestService} from "../services/friendRequest.service";

export const friendRequestResolvers = {
    Query: {
        friendsRequests: (_: any, { id }: { id: string }, ctx: Context) => friendRequestService.friendsRequests(_, { id }, ctx),
    },
    Mutation: {
        sendFriendRequest: (_: any, args: { fromUserId: string; toUserId: string; }, ctx: Context) => friendRequestService.sendFriendRequest(_, args, ctx),
        acceptFriendRequest: (_: any, args: { requestId: string }, ctx: Context) => friendRequestService.acceptFriendRequest(_, args, ctx),
        declineFriendRequest: (_: any, args: { requestId: string }, ctx: Context) => friendRequestService.declineFriendRequest(_, args, ctx),
    }
}