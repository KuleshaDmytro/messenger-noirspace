import { gql } from "@apollo/client";

export const GET_FRIEND_REQUESTS = gql`
    query FriendsRequests($id: String!) {
        friendsRequests(id: $id) {
            id
            fromUser {
                id
                name
                email
            }
            status
            createdAt
        }
    }
`