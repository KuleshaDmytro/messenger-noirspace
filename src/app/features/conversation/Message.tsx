import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { MessageProps } from "./types/message";

export default function Message({ text, isMine, createdAt, user }: MessageProps) {
  return (
    <Stack
      direction="row"
      justifyContent={isMine ? "flex-end" : "flex-start"}
      spacing={1}
      mb={2}
    >
      {!isMine && (
        <Avatar
          src={user?.avatar}
          sx={{ width: 36, height: 36 }}
        />
      )}

      <Box sx={{ maxWidth: "70%", minWidth: "80px",position: "relative" }}>
        {!isMine && (
          <Typography variant="subtitle2" sx={{ color: "error.main" }}>
            {user?.name}
          </Typography>
        )}

        <Paper
          sx={{
            p: 1.5,
            bgcolor: isMine ? "grey.800" : "primary.main",
            color: isMine ? "grey.100" : "primary.contrastText",
            borderRadius: 3,
            position: "relative",
          }}
        >
          <Typography variant="body1">{text}</Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: "right", opacity: 0.7}}
          >
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>

        </Paper>
      </Box>
    </Stack>
  );
}
