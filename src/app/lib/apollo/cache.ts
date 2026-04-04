import { InMemoryCache, Reference } from "@apollo/client";

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                messages: {
                    keyArgs: ['conversationId'],
                    
                    merge(existing, incoming, { args }) {
                        if (!existing) return incoming;

                        const existingRefs = new Set(
                            existing.items?.map((r: Reference) => r.__ref)
                        );

                        if (args?.cursor) {
                            return {
                                ...incoming,
                                items: [
                                    ...incoming.items.filter((r: Reference) => !existingRefs.has(r.__ref)),
                                    ...existing.items,
                                ],
                            };
                        }

                        return {
                            ...incoming,
                            items: [
                                ...existing.items,
                                ...incoming.items.filter((r: Reference) => !existingRefs.has(r.__ref)),
                            ],
                        };
                    }
                }
            }
        },
        Message: {
            keyFields: ['id']
        }
    }
})