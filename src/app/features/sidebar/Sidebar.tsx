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