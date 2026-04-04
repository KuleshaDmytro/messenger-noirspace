import { useSession } from "next-auth/react";
import { GET_FRIENDS } from "../api/getFriends";
import { useTypedQuery } from "@/app/hooks/useTypedQuery";
import { useSubscription } from "@apollo/client";
import { FRIEND_ADDED } from "../api/onFriendsChanged";

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
    const id = session?.user.id ?? "";
  
    const { data, loading, error } = useTypedQuery<friendsData, friendsVars>(GET_FRIENDS, {
        variables: { id},
        skip: !id,
    });

    return {
        friends: data?.getFriends || [],
        loading,
        error
    };
}