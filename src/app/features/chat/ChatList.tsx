import React from "react";
import Box from "@mui/material/Box";
import { LinearProgress } from "@mui/material";

import ChatListItem from "./ChatListItem";
import { useGetFriends } from "../sidebar/friends/hooks/useGetFriends";

export const ChatList = () => {

    const {friends, loading, error} = useGetFriends();

    return (
        <>
            {loading && <LinearProgress />}

            {!error ? (
                friends.map((friendObj) => {
                    const { friend } = friendObj;
                    return (
                    <Box
                        key={friendObj.id}
                        sx={{
                        mx: 1.5,
                        }}
                    >
                        <ChatListItem
                        key={friend.id}
                        userName={friend.name}
                        lastMessage="Last message preview"
                        photoUrl={friend.avatarUrl}
                        // id={friend.id}
                        onClick={() => {
                            // handle click, e.g., select chat
                        }}
                        />
                    </Box>
                    );
                })
            ) : (
            <Box>Error loading friends</Box>
            )}
        </>
    );
};