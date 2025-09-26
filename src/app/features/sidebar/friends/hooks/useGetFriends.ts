import { useSession } from "next-auth/react";
import { GET_FRIENDS } from "../api/getFriends";
import { useTypedQuery } from "@/app/hooks/useTypedQuery";

type friendsData = {
  getFriends: Array<{
    id: string;
    name: string;
    nickName?: string;
    email: string;
    friend: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
  }>;
};

type friendsVars = {
  id: string;
};

export const useGetFriends = () => {
    const { data: session } = useSession();

    const { data, loading, error } = useTypedQuery<friendsData, friendsVars>(GET_FRIENDS, {
        variables: { id: session?.user.id ?? "" },
        skip: !session?.user.id,
    });
    ``
    return {
        friends: data?.getFriends || [],
        loading,
        error
    };
}