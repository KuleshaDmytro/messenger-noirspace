"use client";
import React, { useState } from "react";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SendIcon from "@mui/icons-material/Send";

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Send:", message);
      setMessage("");
    }
  };

  return (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
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
        {/* Emoji */}
        <IconButton size="small" sx={{ color: "gray" }}>
            <EmojiEmotionsOutlinedIcon />
        </IconButton>

        {/* Input */}
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

        {/* Attach file */}
        <IconButton size="small" sx={{ color: "gray" }}>
            <AttachFileOutlinedIcon />
        </IconButton>


        </Paper>

        {/* Send */}
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
