import { gql } from "@apollo/client";

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($requestId: String!) {
    acceptFriendRequest(requestId: $requestId) {
      id
    }
  }
`;