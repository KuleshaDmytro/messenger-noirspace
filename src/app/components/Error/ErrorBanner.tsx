import { useError } from "@/app/hooks/useError";
import { Snackbar, Alert } from "@mui/material";
import { SyntheticEvent } from "react";

export const ErrorBanner = () => {
  const { error, msg, clearError } = useError();

  return (
    <Snackbar
      open={!!error}
      autoHideDuration={7000}
      onClose={clearError}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="error" onClose={clearError}>
        {msg}
      </Alert>
    </Snackbar>
  );
};