import { useSession } from "next-auth/react";
import { GET_FRIEND_REQUESTS } from "../api/getFriendRequests";
import { useTypedQuery } from "@/app/hooks/useTypedQuery";

type friendsRequestsData = {
  friendsRequests: Array<{
    id: string;
    fromUser: { id: string; name: string };
    toUser: { id: string; name: string };
  }>;
};

type friendsRequestsVars = {
  id: string;
};

export const useFriendRequests = () => {
  const { data: session } = useSession();

  const { data, loading, error, refetch } = useTypedQuery<friendsRequestsData, friendsRequestsVars>(GET_FRIEND_REQUESTS, {
    variables: { id: session?.user.id ?? "" },
    skip: !session?.user.id,
  });  

  return {
    friendRequests: data?.friendsRequests || [],
    loading,
    error,
    refetch,
  };
};
