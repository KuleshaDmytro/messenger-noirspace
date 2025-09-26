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
    return prisma.user.findMany({
      where: {
        OR: [
          { nickName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });
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
};
