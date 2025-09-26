import { gql } from "@apollo/client";

export const GET_FRIENDS = gql`
    query GetFriends ($id: String!) {
        getFriends(id: $id) {
            id
            friend {
                id
                email
                nickName
                name
            }
            createdAt
        }
    }
`