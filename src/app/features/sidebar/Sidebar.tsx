'use client'
import { Box, Paper } from "@mui/material";
import { createContext, useEffect, useRef, useState } from "react";
import { ChatList } from "@/app/features/chat/ChatList";
import TopBar from "./topBar/TopBar";

const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 300;

type Props = {
  onWidthChange?: (width: number) => void;
};

type SidebarContextType = {
    showFriendsRequests: boolean;
    setShowFriendsRequests: React.Dispatch<React.SetStateAction<boolean>>;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}
export const SidebarContext = createContext<SidebarContextType | null>(null);

export const Sidebar: React.FC<Props> = ({ onWidthChange }) => {

    const [showFriendsRequests, setShowFriendsRequests] = useState(false);
    const [query, setQuery] = useState<string>("");
    
    const [width, setWidth] = useState(DEFAULT_WIDTH);
    const dragging = useRef(false);
    
    useEffect(() => {
        onWidthChange?.(width);
    }, [width, onWidthChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        dragging.current = true;
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
        const startX = e.clientX;
        const startWidth = width;

        const onMouseMove = (moveEvent: MouseEvent) => {
            if (!dragging.current) return;
            const delta = moveEvent.clientX - startX;
            let newWidth = startWidth + delta;
            newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
            setWidth(newWidth);
        };

        const onMouseUp = () => {
            dragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "none";

            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };


    return(
        <SidebarContext.Provider value={{showFriendsRequests, setShowFriendsRequests, query, setQuery}}>
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
                    : "width 0.3s cubic-bezier(.4,0,.2,1)",
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
        </SidebarContext.Provider>
    )
}