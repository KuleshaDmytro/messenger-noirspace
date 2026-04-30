"use client"
import { Alert, Box, Container, Paper, Slide, Typography } from "@mui/material";
import { AuthErrorProvider, useAuthError } from "../lib/auth/AuthErrorContext";
import { useEffect, useState } from "react";

function AuthShell({ children }: { children: React.ReactNode }) {
    const { error, setError } = useAuthError();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!error) return;

        setOpen(true)

        const timer = setTimeout(() => {
            setOpen(false)
        }, 5000);

        return () => clearTimeout(timer);
    }, [error]);


  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{ backgroundColor: "#1A1A1A", margin: 0 }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative' }}>

        {error && (
            <Slide 
                in={open}
                direction="down"
                mountOnEnter 
                unmountOnExit
                onExited={() => setError(null)}
            >
                <Box
                    sx={{
                      position: "absolute",
                      top: 24,
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      px: 3,
                    }}
                >
                    <Alert severity="error"  onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Box>
            </Slide>
        )}


        <Paper sx={{ p: 4, mt: 12 }}>
          <Typography
            variant="h4"
            mb={2}
            align="center"
            fontFamily={"Audiowide"}
          >
            NoirSpace Messenger
          </Typography>

  

          {children}
        </Paper>
      </Container>
    </Box>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthErrorProvider>
      <AuthShell>{children}</AuthShell>
    </AuthErrorProvider>
  );
}