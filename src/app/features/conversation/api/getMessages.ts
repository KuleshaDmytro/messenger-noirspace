import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!, $cursor: ID, $take: Int) {
    messages(conversationId: $conversationId, cursor: $cursor, take: $take) {
        items {
            id
            senderId
            conversationId
            text
            createdAt
        }
        nextCursor
        hasMore
    }
  }
`;
