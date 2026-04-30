import { prisma } from "../../app/lib/prisma";
import { requireAuth } from "../lib/guards";
import { Context } from "../context";
import { friendService } from "./friend.service";

export const friendRequestService = {
    friendsRequests: (_: any, { id }: { id: string }, ctx: Context) => {
        requireAuth(ctx);

        return prisma.friendRequest.findMany({
        where: {
            toUserId: id,
            status: "PENDING"
        },
        include: {
            fromUser: true
        }
        });
    },

    sendFriendRequest: async (_: any, args: { fromUserId: string; toUserId: string;}, ctx: Context) => {
        requireAuth(ctx);

        const fromUser = await prisma.user.findUnique({ where: { id: args.fromUserId } });
        if (!fromUser) {
            throw new Error("Sender user not found");
        }

        const checkStatus = await prisma.friendRequest.findFirst({
            where: {
                fromUserId: args.fromUserId,
                toUserId: args.toUserId,
                status: "PENDING"
            }
        });
        if (checkStatus) {
            throw new Error("Request already sent");
        }

        await prisma.friendRequest.create({
            data: {
                fromUserId: args.fromUserId,
                toUserId: args.toUserId,
                status: "PENDING"
            }
        });

        return fromUser;
    },

    acceptFriendRequest: async (_: any, args: { requestId: string }, ctx: Context) => {
        requireAuth(ctx);

        const request = await prisma.friendRequest.findUnique({ where: { id: args.requestId } });

        if (!request) throw new Error("Friend request not found");
        if (request.status !== "PENDING") throw new Error("Friend request is not pending");
        console.log(`STATATUS!!!`, request.status);
        
        await prisma.friendRequest.update({
            where: { id: args.requestId },
            data: { status: "ACCEPTED" }
        });

        await prisma.friend.createMany({
        data: [
            { userId: request.fromUserId, friendId: request.toUserId },
            { userId: request.toUserId, friendId: request.fromUserId }
        ]
        });

        const friendA = await prisma.friend.findFirst({
            where: { 
                userId: request.fromUserId,
                friendId: request.toUserId,
             },
            select: {
                id: true,
                friend: true,
                createdAt: true
            },
        });

        const friendB = await prisma.friend.findFirst({
            where: { 
                userId: request.toUserId,
                friendId: request.fromUserId,
            },
            select: {
                id: true,
                friend: true,
                createdAt: true
            },
        });
        
        await friendService.notifyFriendAdded(request.fromUserId, request.toUserId, friendA, friendB);

        return prisma.user.findUnique({
            where: { id: request.toUserId },
            include: { friendsOwned: true }
        });
    },

    declineFriendRequest: async (_: any, args: { requestId: string }, ctx: Context) => {
        requireAuth(ctx);

        const request = await prisma.friendRequest.findUnique({ where: { id: args.requestId } });
        if (!request) {
            throw new Error("Friend request not found");
        }
        if (request.status !== "PENDING") {
            throw new Error("Friend request is not pending");
        }

        await prisma.friendRequest.update({
            where: { id: args.requestId },
            data: { status: "DECLINED" }
        });

        return prisma.user.findUnique({ where: { id: request.fromUserId } });
    }
}