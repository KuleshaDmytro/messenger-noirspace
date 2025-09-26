import {Box, InputBase,LinearProgress,Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useCallback, useContext } from 'react';

import ChatListItem from '@/app/features/chat/ChatListItem';
import { SidebarContext } from '@/app/features/sidebar/Sidebar';
import { useSearchUsers } from './hooks/useSearchUsers';
import { OverlayMenuPaper } from '@/app/components/OverlayMenuPaper/OverlayMenuPaper';

const SearchField: React.FC = () => {

    const context = useContext(SidebarContext);
    if (!context) throw new Error("No MenuContext provided");
    const { query, setQuery, setShowFriendsRequests } = context;

   const { data, loading } = useSearchUsers({ query });

    const handleSearch = useCallback((value: string) => {
        setShowFriendsRequests(false);
        setQuery(value);
    }, []);

    return (
        <>
            <Paper
                component="form"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    bgcolor: "#2A2A2A",
                    borderRadius: "24px",
                    px: 2,
                    py: 0.5,
                    color: "white",
                    position: "relative",
                }}
                elevation={0}
                autoComplete="off"
                onSubmit={e => e.preventDefault()}
            >
                <SearchIcon sx={{ color: "gray" }} />

                <InputBase
                    onChange={(e) => {
                        const value = e.target.value;
                        handleSearch(value);
                        if (!value.trim()) {
                            setQuery("");
                        }
                    }}
                    placeholder="Search"
                    sx={{
                        color: "white",
                        flex: 1,
                        fontSize: "0.95rem",
                        pl: 1,
                    }}
                    inputProps={{ "aria-label": "search" }}
                />
            </Paper>
 
            {(query.trim()) && (
                <OverlayMenuPaper>
                    {/* {loading && (
                        <LinearProgress />
                    )} */}
                    {!loading && data?.searchUsers?.length === 0 && (
                        <Box style={{ padding: 16, textAlign: "center" }}>No results</Box>
                    )}
                    {!loading && data?.searchUsers?.map((user: any) => (
                        <Box
                            key={user.id}
                            sx={{
                                mx: 1.5,
                                cursor: "pointer",
                            }}
                        >
                            <ChatListItem userName={user.name} photoUrl={user.photoUrl} id={user.id} newFriend={true}/>
                        </Box>
                    ))}
                    {!loading && !data?.searchUsers && (
                        <Box style={{ padding: 16, textAlign: "center", color: "red" }}>
                            Error loading users
                        </Box>
                    )}
                </OverlayMenuPaper>
            )}
        </>
    );
};

export default SearchField;