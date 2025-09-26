import { prisma } from "../../app/lib/prisma";
import { Context } from "../context";

export const friendService = {
    getFriends: (_: any, {id}: {id: string}, ctx: Context) => {
        if (!ctx.session) throw new Error("Unauthorized");

        const friends = prisma.friend.findMany({
             where: { userId: id },
             include: { 
               friend: true 
             }
           });
        return friends;
    },
}