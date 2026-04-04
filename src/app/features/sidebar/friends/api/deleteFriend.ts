import { gql } from "@apollo/client";

export const DELETE_FRIEND = gql`
    mutation DeleteFriend($friendId: String!){
        deleteFriend(friendId: $friendId)
    }
`;