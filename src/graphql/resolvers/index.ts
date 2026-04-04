import { userResolvers } from "./user.resolver";
import { messageResolvers } from "./message.resolver";
import { friendResolvers } from "./friend.resolver";
import { friendRequestResolvers } from "./friendRequest.resolver";
import { mergeResolvers } from "@graphql-tools/merge";
import { conversationResolvers } from "./conversation.resolvers";

export const resolvers = mergeResolvers([
  userResolvers,
  messageResolvers,
  friendResolvers,
  friendRequestResolvers,
  conversationResolvers,
]);

