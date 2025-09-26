import { ACCEPT_FRIEND_REQUEST } from "../api/acceptFriendRequest";
import { useTypedMutation } from "@/app/hooks/useTypedMutation";

type AcceptFriendRequestData = {
  acceptFriendRequest: {
    success: boolean;
    message: string;
  };
};

type AcceptFriendRequestVars = {
  requestId: string;
};

export const useAcceptFriendRequest = ({ requestId }: AcceptFriendRequestVars) => {
    const [acceptFriendRequest, {data, loading, error }] = useTypedMutation<AcceptFriendRequestData, AcceptFriendRequestVars>(ACCEPT_FRIEND_REQUEST, {
        variables: {
           requestId
        }
    });
    return {
        loading,
        error
    };
}