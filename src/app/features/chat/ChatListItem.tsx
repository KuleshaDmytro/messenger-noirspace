import React from 'react';

import { Avatar, Typography, ListItem, ListItemAvatar, ListItemText, Box, IconButton, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import { gql, useMutation } from '@apollo/client';

import { useSession } from 'next-auth/react';

import { ACCEPT_FRIEND_REQUEST } from '../sidebar/friends/api/acceptFriendRequest';
import { DECLINE_FRIEND_REQUEST } from '../sidebar/friends/api/declineFriendRequest';
import { SEND_FRIEND_REQUEST } from '../sidebar/friends/api/sendFriendRequest';

type ChatListItemProps = {
    id?: string;
    newFriend?: boolean;
    showFriendRequestActions?: boolean;
    userName: string;
    lastMessage?: string;
    photoUrl?: string | null;
    requestId?: string | undefined;
    onClick?: () => void;
};

const ChatListItem: React.FC<ChatListItemProps> = ({
    id,
    newFriend,
    showFriendRequestActions,
    userName,
    lastMessage,
    photoUrl,
    requestId,
    onClick,
}) => {
    const { data: session } = useSession();
    
    const [sendFriendRequest, { loading: sending, error: sendError }] = useMutation(SEND_FRIEND_REQUEST);

    const userId = session?.user?.id;

    const handleSendFriendRequest = (fromUserId: string | undefined, toUserId: string | undefined) => {
        sendFriendRequest({
            variables: {
                fromUserId,
                toUserId
            }
        });
    };

    const [ acceptFriendRequest, { loading: accepting, error: acceptError }] = useMutation(ACCEPT_FRIEND_REQUEST);
    const handleAcceptFriendRequest = (requestId: string | undefined) => {
        acceptFriendRequest({ 
            variables: { requestId } 
        });
    };

    const [ declineFriendRequest, { loading: declining, error: declineError }] = useMutation(DECLINE_FRIEND_REQUEST);
    const handleDeclineFriendRequest = (requestId: string | undefined) => {
        declineFriendRequest({ 
            variables: { requestId } 
        });
    };

    if (!userId) return null;

    return (
        <ListItem
            alignItems="flex-start"
            onClick={onClick}
            sx={{
            borderRadius: 2,
            px: 2,
            py: 1,
            cursor: "pointer",
            transition: 'background 0.2s',
            backgroundColor: 'transparent',
            border: 'none',
            '&:hover': {
                backgroundColor: 'action.hover',
            },
            }}
            tabIndex={0}
        >
            <ListItemAvatar>
                <Avatar
                    src={photoUrl || '/person.svg'}
                    alt={userName}
                    sx={{
                        width: 50,
                        height: 50,
                        mr: 2,
                        bgcolor: 'white',
                        borderRadius: '50%',
                    }}
                />
            </ListItemAvatar>
            <ListItemText
            primary={
                <Typography
                variant="subtitle1"
                fontWeight={600}
                noWrap
                sx={{
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
                >
                {userName}
                </Typography>
            }
            secondary={
                <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
                >
                {lastMessage}
                </Typography>
            }
            sx={{ mt: 0.5 }}
            />

            {showFriendRequestActions && (
                <>
                    <Tooltip title="Accept" arrow>
                        <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleAcceptFriendRequest(requestId)}
                            sx={{ 
                                mr: 1,
                                alignSelf: 'center',
                             }}
                        >
                            <PersonAddAlt1Icon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Decline" arrow>
                        <IconButton
                            size="small"
                            color="error"
                            sx={{ 
                                alignSelf: 'center',
                             }}
                            onClick={() => handleDeclineFriendRequest(requestId)}
                        >
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )}

            {newFriend && (
                <Tooltip title="Add friend" arrow>
                    <IconButton
                        size="small"
                        sx={{
                            ml: 1,
                            alignSelf: 'center',
                            color: 'white',
                            transition: 'color 0.2s',
                            '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'transparent',
                            },
                        }}
                        onClick={e => {
                            e.stopPropagation();

                            handleSendFriendRequest(
                                userId,
                                id
                            );
                        }}
                    >
                        <PersonAddAlt1Icon />
                    </IconButton>
                </Tooltip>
            )}

        </ListItem>
    );
};

export default ChatListItem;