import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($email: String!, $name: String! ,$password: String!, $nickName: String!) {
        createUser(email: $email, name: $name, password: $password,  nickName: $nickName ) {
            id
            email
            name
            nickName
        }
    }
`;