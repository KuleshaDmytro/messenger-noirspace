import { prisma } from "../../app/lib/prisma";
import { Context } from "../context";
import { requireAuth } from "../lib/guards";

const makeDirectKey = (a: string, b: string) => (a < b ? `${a}:${b}` : `${b}:${a}`);

export const conversationService = {
  getOrCreateDirect: async (ctx: Context, friendId: string) => {
    const session = requireAuth(ctx);
    const meId = session.id;

    if (meId === friendId) throw new Error("You cannot chat with yourself");

    const directKey = makeDirectKey(meId, friendId);

    const existing = await prisma.conversation.findUnique({
      where: { directKey },
    });
    if (existing) return existing;

    try {
      return await prisma.conversation.create({
        data: {
          directKey,
          members: {
            create: [{ userId: meId }, { userId: friendId }],
          },
        },
      });
    } catch (e: any) {
      const createdByOther = await prisma.conversation.findUnique({ where: { directKey } });
      if (createdByOther) return createdByOther;
      throw e;
    }
  },
};