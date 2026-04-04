import { gql } from "@apollo/client";

export const MESSAGE_ADDED = gql`
  subscription OnMessageAdded($conversationId: ID!) {
    messageAdded(conversationId: $conversationId) {
      id
      senderId
      conversationId
      text
      createdAt
    }
  }
`;