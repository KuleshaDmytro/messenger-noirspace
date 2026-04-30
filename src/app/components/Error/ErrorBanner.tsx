import { useError } from "@/app/hooks/useError";
import { Alert, Slide, Box } from "@mui/material";
import { useEffect } from "react";

export const ErrorBanner = () => {
  const { error, msg, clearError } = useError();

  useEffect(() => {
    if(!error) return;

    const timer = setTimeout(() => {
      clearError();
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <Slide
      in={!!error}
      direction="down"
      mountOnEnter
      unmountOnExit
      onExit={clearError}
    >
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 0,
          right: 0,
          zIndex: 10,
          px: 50,
        }}
      >
        <Alert severity="error" onClose={clearError}>
          {msg}
        </Alert>
      </Box>
    </Slide>
  );
};