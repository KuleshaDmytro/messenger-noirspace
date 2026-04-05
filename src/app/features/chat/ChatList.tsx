import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { LinearProgress } from "@mui/material";

import ChatListItem from "./ChatListItem";
import { useRealtimeFriends } from "./hooks/useRealtimeFriends";
import { useRouter } from "next/navigation";
import { useDirectConversation } from "../conversation/hooks/useDirectConversation";
import { useError } from "@/app/hooks/useError";

const ERROR_MSG = "Failed to load friends. Please try again.";

export const ChatList = () => {

    const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
    const { friends, loading, error} = useRealtimeFriends();
    const router = useRouter();

    const { openConversation } = useDirectConversation();

    const onFriendClick = async (friendId: string) => {
        const res = await openConversation({ variables: { friendId } });
        setActiveFriendId(friendId);
        
        const conversationId = res.data?.getOrCreateDirectConversation.id;
        if (!conversationId) return;

        router.push(`/chat/${conversationId}`);
    };

    const { showError, clearError } = useError();
    
        useEffect(() => {
            if (error) {
                showError(error, ERROR_MSG);
            } else {
                clearError();
            }
        }, [error]);

    return (
        <Box
            style={{
                overflow: 'auto'
            }}
        >
            {loading && <LinearProgress />}
            
            {friends.map((friendObj) => 
                {
                    const { friend } = friendObj;
                    return (
                        <Box
                            key={friendObj.friend.id}
                            sx={{
                                mx: 1.5,
                                py: 0.5,
                            }}
                        >
                            <ChatListItem
                                key={friend.id}
                                id={friend.id}
                                userName={friend.name}
                                isActive={friend.id === activeFriendId}
                                lastMessage="Last message preview"
                                photoUrl={friend.avatarUrl}
                                onClick={() => onFriendClick(friend.id)}
                            />
                        </Box>
                    );
                })
            }
        </Box>
    );
};