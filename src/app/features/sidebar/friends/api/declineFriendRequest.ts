import { gql } from "@apollo/client";

export const DECLINE_FRIEND_REQUEST = gql`
    mutation DeclineFriendRequest($requestId: String!) {
        declineFriendRequest(requestId: $requestId) {
            id
        }
    }
`;
