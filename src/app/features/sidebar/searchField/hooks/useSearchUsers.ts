import { SEARCH_USERS } from "../api/searchUsers";
import { useTypedQuery } from "@/app/hooks/useTypedQuery";

type SearchUsersData = {
    searchUsers: Array<{
        id: string;
        name: string;
        email: string;
        nickName: string;
        avatarUrl?: string;
    }>;
};

type SearchUsersVars = {
    query: string;
}

export const useSearchUsers = ({ query }: SearchUsersVars) => {
    const {data, loading, error }= useTypedQuery<SearchUsersData, SearchUsersVars>(SEARCH_USERS, {
        variables: { query }
    });
    return {
        data,
        loading,
        error
    };
};
