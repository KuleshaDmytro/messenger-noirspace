import { gql } from "@apollo/client";

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    text
    createdAt
  }
`