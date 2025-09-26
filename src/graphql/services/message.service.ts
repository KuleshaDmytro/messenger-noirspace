import { prisma } from "../../app/lib/prisma";
import { Context } from "../context";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const messageService = {
  getAll: (ctx: Context) => {
    if (!ctx.session) throw new UnauthorizedError();
    return prisma.message.findMany({ include: { sender: true, recipient: true } });
  },

  send: (ctx: Context, senderId: string, recipientId: string, text: string) => {
    if (!ctx.session) throw new UnauthorizedError();

    return prisma.message.create({
      data: { senderId, recipientId, text },
    });
  },
};
