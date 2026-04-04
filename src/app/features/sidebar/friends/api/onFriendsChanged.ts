import { gql } from "@apollo/client";

export const FRIEND_ADDED = gql`
  subscription FriendAdded($userId: String!) {
    friendAdded(userId: $userId) {
      friend {
        friend {
            id
            email
            nickName
            name
        }
        createdAt
      }
    }
  }

`;

export const Friend_Removed = gql`
    subscription FriendRemoved($id: String!){
        friendRemoved(id: $id){
            id
        }
    }
`

export const Friend_Status_Changed = gql`
    subscription FriendStatusChanged($id: String!){
        friendStatusChanged(id: $id) {
            id
            isOnline
        }
    }
`

