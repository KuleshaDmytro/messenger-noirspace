import { useFriendRequests } from "./hooks/useFriendRequests";

import { Box, LinearProgress } from "@mui/material";

import { OverlayMenuPaper } from "@/app/components/OverlayMenuPaper/OverlayMenuPaper";
import ChatListItem from "../../chat/ChatListItem";

interface FriendRequest {
    id: string;
    status: "pending" | "accepted" | "declined";
    createdAt: string;
    fromUser: {
        id: string;
        name: string;
        photoUrl: string | null | undefined;
    };
}

export const FriendRequests: React.FC = () => {

    const { friendRequests, loading, error } = useFriendRequests();
    
    if (error) return <p>Error: {error.message}</p>;

    return (
        <OverlayMenuPaper>
            {loading && <LinearProgress/>}
            {friendRequests.map((user) => (
                <Box
                    key={user.fromUser.id}
                    sx={{
                        mx: 1.5,
                        cursor: "pointer",
                    }}
                >
                    <ChatListItem userName={user.fromUser.name} photoUrl={'user.fromUser.photoUrl'} id={user.fromUser.id} requestId={user.id} showFriendRequestActions={true}/>
                </Box>
            ))}
        </OverlayMenuPaper>
    );
};
