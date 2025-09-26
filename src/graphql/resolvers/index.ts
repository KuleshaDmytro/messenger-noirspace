import { userResolvers } from "./user.resolver";
import { messageResolvers } from "./message.resolver";
import { friendResolvers } from "./friend.resolver";
import { friendRequestResolvers } from "./friendRequest.resolver";

export const resolvers = [
  userResolvers,
  messageResolvers,
  friendResolvers,
  friendRequestResolvers,
];
