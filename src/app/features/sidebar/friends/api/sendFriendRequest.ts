import { gql } from "@apollo/client";

export const SEND_FRIEND_REQUEST = gql`
    mutation SendFriendRequest($fromUserId: String!, $toUserId: String!) {
        sendFriendRequest(fromUserId: $fromUserId, toUserId: $toUserId) 
        {
            id
        }
    }
`;