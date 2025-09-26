import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../api/createUser";

export const useCreateUser = () => {
    const [createUser, { loading, error }] = useMutation(CREATE_USER, {
        errorPolicy: "all",
    });
    return { createUser, loading, error };
}