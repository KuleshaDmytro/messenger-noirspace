import { Context } from "../context";
import { userService } from "../services/user.service";

export const userResolvers = {

  User: {
    isFriend:  (parent: any, _args: any, ctx: Context) => userService.isFriend(parent, _args, ctx)
  },

  Query: {
    users: (_: any, __: any, ctx: Context) => userService.getAll(ctx),
    me: (_: any, { id }: { id: string }, ctx: Context) => userService.getById(id, ctx),
    searchUsers: (_: any, { query }: { query: string }, ctx: Context) => userService.search(query, ctx),
  },
  Mutation: {
    createUser: (_: any, { email, name, password, nickName }: { email: string; name: string; password: string; nickName: string }, ctx: Context) =>
      userService.create(email, name, password, nickName, ctx),
  },
};
