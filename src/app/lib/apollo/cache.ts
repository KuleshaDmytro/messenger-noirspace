// import { InMemoryCache, Reference } from "@apollo/client";

// export const cache = new InMemoryCache({
//     typePolicies: {
//         Query: {
//             fields: {
//                 messages: {
//                     keyArgs: ['conversationId'],
                    
//                     merge(existing, incoming, { args }) {
//                         if (!existing) return incoming;

//                         const existingRefs = new Set(
//                             existing.items?.map((r: Reference) => r.__ref)
//                         );

//                         if (args?.cursor) {
//                             return {
//                                 ...incoming,
//                                 items: [
//                                     ...incoming.items.filter((r: Reference) => !existingRefs.has(r.__ref)),
//                                     ...existing.items,
//                                 ],
//                             };
//                         }

//                         return {
//                             ...incoming,
//                             items: [
//                                 ...existing.items,
//                                 ...incoming.items.filter((r: Reference) => !existingRefs.has(r.__ref)),
//                             ],
//                         };
//                     }
//                 }
//             }
//         },
//         Message: {
//             keyFields: ['id']
//         }
//     }
// })

// cache.ts
import { InMemoryCache, Reference, FieldMergeFunction } from "@apollo/client";

const MAX_MESSAGES_IN_CACHE = 50;

interface MessagesField {
  items: Reference[];
  hasMore: boolean;
  nextCursor?: string | null;
}

const mergeMessages: FieldMergeFunction<MessagesField> = (
  existing,
  incoming,
  { args }
) => {
  if (!existing) return incoming;

  const existingRefs = new Set(
    existing.items?.map((r: Reference) => r.__ref)
  );

  // Підвантаження старіших (скролл вгору) — incoming йде на початок
  if (args?.cursor) {
    const merged = [
      ...incoming.items.filter((r: Reference) => !existingRefs.has(r.__ref)),
      ...existing.items,
    ];

    return {
      ...incoming,
      // Обрізаємо найстаріші якщо список занадто великий
      items: merged.length > MAX_MESSAGES_IN_CACHE
        ? merged.slice(-MAX_MESSAGES_IN_CACHE)
        : merged,
    };
  }

  // Нові повідомлення (subscription / initial load) — incoming йде в кінець
  const merged = [
    ...existing.items,
    ...incoming.items.filter((r: Reference) => !existingRefs.has(r.__ref)),
  ];

  return {
    ...incoming,
    // Обрізаємо найстаріші якщо список занадто великий
    items: merged.length > MAX_MESSAGES_IN_CACHE
      ? merged.slice(-MAX_MESSAGES_IN_CACHE)
      : merged,
  };
};

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        messages: {
          keyArgs: ["conversationId"],
          merge: mergeMessages,
        },
      },
    },
    Message: {
      keyFields: ["id"],
    },
  },
});