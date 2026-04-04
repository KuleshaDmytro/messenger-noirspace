import { useSubscription } from "@apollo/client";
import { useSession } from "next-auth/react";
import { FRIEND_ADDED } from "../api/onFriendsChanged";

export const useFriendAdded = () => {
  const { data: session } = useSession();
  const userId = session?.user.id ?? "";
  
  const { data, loading, error } = useSubscription(FRIEND_ADDED, {
    skip: !userId,
    variables: { userId },
  });
  
  const newFriend = data?.friendAdded?.friend ?? null;

  return { newFriend, loading, error };
};