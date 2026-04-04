"use client";
import React, { useState } from "react";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "next/navigation";
import { useSendMessage } from "./hooks/useSendMessage";

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState("");

  const params = useParams();
  const conversationId = params.id as string;
  const { sendMessage, loading } = useSendMessage(conversationId);

  const handleSend = async () => {
    if (!message) return;

    if (message.trim()) {
        await sendMessage(message);
        setMessage("");
    }
  };

  return (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            px: 1, 
            position: "sticky",
            bottom: 0,
            backdropFilter: 'blur(3px)',
            borderRadius: '16px',
        }}
    >
        <Paper
            elevation={0}
            sx={{
                p: "4px 8px",
                
                borderRadius: "24px",
                backgroundColor: "background.paper",
                color: "white",
                width: "100%",
        }}
        >
        <IconButton size="small" sx={{ color: "gray" }}>
            <EmojiEmotionsOutlinedIcon />
        </IconButton>

        <InputBase
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
                ml: 1,
                flex: 1,
                color: "text.primary",
                width: "calc(100% - 96px)",
            }}
            onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
            }}
        />

        <IconButton size="small" sx={{ color: "gray" }}>
            <AttachFileOutlinedIcon />
        </IconButton>


        </Paper>

        <IconButton
            size="medium"
            sx={{
            color: "palette.sendIcon",
            ml: 1,
            backgroundColor: "background.paper",
                "&:hover": { backgroundColor: "primary.main", color: '#1A1A1A', transition: "all 0.3s" },
            }}
            onClick={handleSend}
        >
            <SendIcon />
        </IconButton>

    </Box>
  );
};

export default MessageInput;
