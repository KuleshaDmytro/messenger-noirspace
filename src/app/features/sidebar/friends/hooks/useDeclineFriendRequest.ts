import { useMutation } from "@apollo/client";
import { DECLINE_FRIEND_REQUEST } from "../api/declineFriendRequest";
import { useTypedMutation } from "@/app/hooks/useTypedMutation";

type DeclineFriendRequestData = {
    declineFriendRequest: {
        success: boolean;
        message: string;
    };
};
type DeclineFriendRequestVars = {
    requestId: string;
};

export const useDeclineFriendRequest = ({ requestId }: DeclineFriendRequestVars) => {
    const [declineFriendRequest, { loading, error }] = useTypedMutation<DeclineFriendRequestData, DeclineFriendRequestVars>(DECLINE_FRIEND_REQUEST, {
        variables: { requestId }
    })
    return { 
        declineFriendRequest, 
        loading, 
        error 
    }
}