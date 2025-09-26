// import { createYoga, createSchema } from "graphql-yoga"
// import { prisma } from "../../lib/prisma"
// import bcrypt from "bcrypt"

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// const yoga = createYoga({
//   schema: createSchema({
//     typeDefs:`
//       type User {
//         password: String!
//         id: ID!
//         email: String!
//         name: String!
//         nickName: String
//         friends: [User!]!                 # масив друзів (повні дані)
//         sentMessages: [Message!]!
//         receivedMessages: [Message!]!
//         sentFriendRequests: [FriendRequest!]!     # заявки, які користувач відправив
//         receivedFriendRequests: [FriendRequest!]! # заявки, які користувач отримав
//       }

//       type Friend{
//         id: ID!
//         user: User!    # хто додав
//         friend: User!  # кого додали
//         createdAt: String!
//       }

//       type FriendRequest {
//         id: ID!
//         fromUser: User!
//         toUser: User!
//         status: String!
//         createdAt: String!
//       }

//       type Message {
//         id: ID!
//         text: String!
//         createdAt: String!
//         sender: User!
//         recipient: User!
//       }

//       type Query {
//         users: [User!]!
//         messages: [Message!]!
//         searchUsers(query: String!): [User!]!
//         me: User!
//         getFriends(id: String!): [Friend!]!
//         friendsRequests(id: String!): [FriendRequest!]!
//       }

//       type Mutation {
//         createUser(email: String!, name: String!, password: String!, nickName: String): User!
//         sendMessage(senderId: String!, recipientId: String!, text: String!): Message!

//         #Friends
//         sendFriendRequest(fromUserId: String!, toUserId: String!): FriendRequest!
//         acceptFriendRequest(requestId: String!): User!  # повертає оновленого користувача
//         declineFriendRequest(requestId: String!): User! # повертає оновленого користувача
//       }

//     `,

//     resolvers: {
//       Query: {
//         users: () => prisma.user.findMany({
//           where: { nickName: { not: undefined } },
//         }),

//         me: (_: any, {id}: {id: string}) => prisma.user.findUnique({ where: { id } }),

//         messages: () => prisma.message.findMany({ include: { sender: true, recipient: true } }),
        
//         searchUsers: async (_: any, { query } : { query: string }) => {
//           if (query.trim() === "") {
//             return [];
//           }
          
//           const users = await prisma.user.findMany({
//             where: {
//               OR: [
//                 { nickName: { contains: query, mode: "insensitive" } },
//                 { email: { contains: query, mode: "insensitive" } }
//               ]
//             },
//             take: 10
//           });
//           return users.length ? users : [];
//         },

//         getFriends: (_: any, {id}: {id: string}) => {
//           const friends = prisma.friend.findMany({
//              where: { userId: id },
//              include: { 
//                friend: true 
//              }
//            });
//           return friends;
//         },

//         friendsRequests: (_: any, { id }: { id: string }) => {
//           return prisma.friendRequest.findMany({
//             where: {
//               toUserId: id,
//               status: "PENDING"
//             },
//             include: {
//               fromUser: true
//             }
//           });
//         }

//       },

//       Mutation: {
//         createUser: async (
//           _: any,
//           args: { email: string; name: string; password: string; nickName: string }
//         ) => {
//           const existingUser = await prisma.user.findUnique({
//             where: { email: args.email },
//           })
//           if (existingUser) {
//             throw new Error("User already exists")
//           }
//           const hashedPassword = await bcrypt.hash(args.password, 10)

//           return prisma.user.create({
//             data: {
//               email: args.email,
//               name: args.name,
//               nickName: args.nickName,
//               password: hashedPassword,
//             },
//           })
//         },

//         sendMessage: (_: any, args: { senderId: string; recipientId: string; text: string }) =>
//           prisma.message.create({
//             data: {
//               senderId: args.senderId,
//               recipientId: args.recipientId,
//               text: args.text,
//             },
//           }),

//         sendFriendRequest: async (_: any, args: { fromUserId: string; toUserId: string;}) => {

//           const fromUser = await prisma.user.findUnique({ where: { id: args.fromUserId } });
//           if (!fromUser) {
//             throw new Error("Sender user not found");
//           }

//           const checkStatus = await prisma.friendRequest.findFirst({
//             where: {
//               fromUserId: args.fromUserId,
//               toUserId: args.toUserId,
//               status: "PENDING"
//             }
//           });
//           if (checkStatus) {
//             throw new Error("Request already sent");
//           }

//           await prisma.friendRequest.create({
//             data: {
//               fromUserId: args.fromUserId,
//               toUserId: args.toUserId,
//               status: "PENDING"
//             }
//           });

//           return fromUser;
//         },

//         acceptFriendRequest: async (_: any, args: { requestId: string }) => {
//           const request = await prisma.friendRequest.findUnique({ where: { id: args.requestId } });
//           if (!request) throw new Error("Friend request not found");
//           if (request.status !== "PENDING") throw new Error("Friend request is not pending");

//           await prisma.friendRequest.update({
//             where: { id: args.requestId },
//             data: { status: "ACCEPTED" }
//           });

//           await prisma.friend.createMany({
//             data: [
//               { userId: request.fromUserId, friendId: request.toUserId },
//               { userId: request.toUserId, friendId: request.fromUserId }
//             ]
//           });

//           return prisma.user.findUnique({
//             where: { id: request.toUserId },
//             include: { friendsOwned: true }
//           });
//         },

//         declineFriendRequest: async (_: any, args: { requestId: string }) => {
//           const request = await prisma.friendRequest.findUnique({ where: { id: args.requestId } });
//           if (!request) {
//             throw new Error("Friend request not found");
//           }
//           if (request.status !== "PENDING") {
//             throw new Error("Friend request is not pending");
//           }

//           await prisma.friendRequest.update({
//             where: { id: args.requestId },
//             data: { status: "DECLINED" }
//           });

//           return prisma.user.findUnique({ where: { id: request.fromUserId } });
//         }
//       },

//       // User: {
//       //   messages: (parent) =>
//       //     prisma.message.findMany({ where: { senderId: parent.id }, include: { recipient: true } }),

//       //   received: (parent) =>
//       //     prisma.message.findMany({ where: { recipientId: parent.id }, include: { sender: true } }),
//       // },

//       // Message: {
//       //   sender: (parent) => prisma.user.findUnique({ where: { id: parent.senderId } }),
//       //   recipient: (parent) => prisma.user.findUnique({ where: { id: parent.recipientId } }),
//       // },
//     },
//   }),
//   graphqlEndpoint: process.env.API_GRAPHQL_URL,
//   graphiql: true,
//   fetchAPI: { Request: Request, Response: Response },
// });

// export { yoga as GET, yoga as POST };

export { config, GET, POST } from "@/graphql/yoga";

