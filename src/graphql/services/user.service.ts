import { prisma } from "../../app/lib/prisma";
import bcrypt from "bcrypt";
import { Context } from "../context";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const userService = {
  getAll: (ctx: Context) => {
    if (!ctx.session) throw new UnauthorizedError();
    return prisma.user.findMany({ where: { nickName: { not: undefined } } });
  },

  getById: (id: string, ctx: Context) => {
    if (!ctx.session) throw new UnauthorizedError();

    return prisma.user.findUnique({ where: { id } });
  },

  search: async (query: string, ctx: Context) => {
    if (!ctx.session) throw new UnauthorizedError();
    if (!query.trim()) return []; 
    const currentUserId = ctx.session.id;

    const users = prisma.user.findMany({
      where: {
        NOT: {
          id: currentUserId,
        },
        OR: [
          { nickName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    return users;
  },

  create: async (email: string, name: string, password: string, nickName: string, ctx: Context) => {
    if (!ctx.session) throw new UnauthorizedError();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: { email, name, password: hashed, nickName },
    });
  },

 isFriend: async (parent: any, _args: any, ctx: Context) => {
      try {
        const currentUserId = ctx.session?.id;
        if (!currentUserId) return false;

        if (parent.id === currentUserId) return false;

        const friend = await prisma.friend.findFirst({
          where: {
            OR: [
              { userId: currentUserId, friendId: parent.id },
              { userId: parent.id, friendId: currentUserId },
            ],
          },
        });

        return !!friend;
      } catch (e) {
        console.error("isFriend resolver error:", e);
        return false;
      }
    },

};
