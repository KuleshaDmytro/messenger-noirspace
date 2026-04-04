import { useEffect, useState } from "react";
import { useGetFriends } from "../../sidebar/friends/hooks/useGetFriends";
import { useFriendAdded } from "../../sidebar/friends/hooks/useFriendAdded";

export const useRealtimeFriends = () => {
    const { friends, loading, error } = useGetFriends();
    const { newFriend } = useFriendAdded();
    const [friendList, setFriendList] = useState<typeof friends>([]);
    
    useEffect(() => {
        if (loading || friends.length === 0) return;

        setFriendList((prev) => {
            const same =
            prev.length === friends.length &&
            prev.every((f, i) => f.friend.id === friends[i].friend.id);
            return same ? prev : friends;
        });
    }, [friends, loading]);

    useEffect(() => {
        if (newFriend) {
            setFriendList((prev) =>
                prev.some((f) => f.friend.id === newFriend.id) ? prev : [ newFriend, ...prev ]
            );
        }
    }, [newFriend]);

    return { friends: friendList, loading, error };
};
