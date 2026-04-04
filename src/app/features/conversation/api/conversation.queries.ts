import { gql } from "@apollo/client";

export const GET_OR_CREATE_DIRECT_CONVERSATION = gql`
  query GetOrCreateDirectConversation($friendId: ID!) {
    getOrCreateDirectConversation(friendId: $friendId) {
      id
      createdAt
    }
  }
`;