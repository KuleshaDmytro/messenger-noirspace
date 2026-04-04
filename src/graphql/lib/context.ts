// import { pubsub } from "./pubsub";

// export async function createWsContext(ctx: any) {
//   const { connectionParams } = ctx;

//   // наприклад, токен передається через connectionParams
//   const token = connectionParams?.token ?? null;

//   const session = token
//     ? { id: "decoded-from-token", nickName: "User" } // тут можна розпарсити JWT
//     : null;

//   return { session, pubsub };
// }


import { pubsub } from "./pubsub";

export async function createWsContext(ctx: any) {

  const session = ctx.connectionParams?.session ?? null;

  return {
    pubsub,
    session,
  };
}
