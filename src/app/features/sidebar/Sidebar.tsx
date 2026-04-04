'use client'
import { useRef, useState } from "react";

import { Box, ClickAwayListener, Paper } from "@mui/material";

import { ChatList } from "@/app/features/chat/ChatList";
import TopBar from "./topBar/TopBar";
import { useResizableSidebar } from "@/app/hooks/useResizableWidth";
import { SidebarContext, SidebarMenuView } from "@/app/hooks/useSidebarContext";

const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 300;

type Props = {
  onWidthChange?: (width: number) => void;
};


// const products = [
//   {
//     id: 1,
//     users: [
//       { id: 1, name: 'Alice' },
//       { id: 2, name: 'Bob' },
//       { id: 3, name: 'Charlie' },
//       { id: 4, name: 'Diana' },
//       { id: 5, name: 'Ethan' },
//       { id: 6, name: 'Fiona' },
//       { id: 7, name: 'George' },
//       { id: 8, name: 'Hannah' },
//       { id: 9, name: 'Ivan' },
//       { id: 10, name: 'Julia' },
//     ],
//   },
//   {
//     id: 2,
//     users: [
//       { id: 11, name: 'Kevin' },
//       { id: 2, name: 'Bob' },
//       { id: 13, name: 'Michael' },
//       { id: 14, name: 'Nina' },
//       { id: 15, name: 'Oscar' },
//       { id: 16, name: 'Paula' },
//       { id: 17, name: 'Quentin' },
//       { id: 9, name: 'Ivan' },
//       { id: 19, name: 'Steve' },
//       { id: 20, name: 'Tina' },
//     ],
//   },
//     {
//     id: 3,
//     users: [
//       { id: 11, name: 'Kevin' },
//       { id: 2, name: 'Bob' },
//       { id: 13, name: 'Michael' },
//       { id: 21, name: 'Nina' },
//       { id: 22, name: 'Oscar' },
//       { id: 16, name: 'Paula' },
//       { id: 17, name: 'Quentin' },
//       { id: 9, name: 'Ivan' },
//       { id: 23, name: 'Steve' },
//       { id: 20, name: 'Tina' },
//     ],
//   },
// ]


export const Sidebar: React.FC<Props> = ({ onWidthChange }) => {

    const [query, setQuery] = useState<string>("");
    const [activeMenuView, setActiveMenuView] = useState<SidebarMenuView>('none');

    const dragging = useRef(false);
    
    const { width, handleMouseDown } = useResizableSidebar({
        minWidth: MIN_WIDTH,
        maxWidth: MAX_WIDTH,
        defaultWidth: DEFAULT_WIDTH,
        onWidthChange,
    });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget );
    };

    const handleMenuClose = () => {
        if (anchorEl !== null) {
            setAnchorEl(null);  
        }
    };

    // function getUniqueUsers(products: any) {
    //     const map = new Map();

    //     for (const { users } of products) {
    //         for (const user of users) {
    //         map.set(user.id, user);
    //         }
    //     }

    //     return [...map.values()];
    // }

    // const result = getUniqueUsers(products)
  
    return(

        <SidebarContext.Provider value={{query, setQuery, handleMenuOpen, anchorEl, handleMenuClose, activeMenuView, setActiveMenuView}}>
            <ClickAwayListener
                onClickAway={() => {                   
                    setActiveMenuView('none')
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                    width,
                    minWidth: MIN_WIDTH,
                    maxWidth: MAX_WIDTH,
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,
                    boxShadow: 3,
                    transition: dragging.current
                        ? "none"
                        : "width 0.1s cubic-bezier(.4,0,.2,1)",
                    bgcolor: "#1A1A1A",
                    color: "white",
                    borderRadius: 0,
                }}
                >
                    <TopBar />

                    <ChatList />

                    <Box
                        onMouseDown={handleMouseDown}
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            width: 3,
                            height: "100%",
                            cursor: "ew-resize",
                            zIndex: 20,
                            bgcolor: "rgba(255,255,255,0.02)",
                            transition: "background 0.2s",
                            "&:hover": {
                                bgcolor: "rgba(255,255,255,0.08)",
                            },
                        }}
                    />
                </Paper>
            </ClickAwayListener>
        </SidebarContext.Provider>
    )
}