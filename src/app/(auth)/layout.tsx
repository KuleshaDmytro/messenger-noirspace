import { Box, Container, Paper, Typography } from "@mui/material";
import '@fontsource/audiowide';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box display="flex" minHeight="100vh" sx={{ backgroundColor: '#1A1A1A', margin: 0 }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4, mt: 12 }}>
                    <Typography variant="h4" mb={2} align="center" fontFamily={'Audiowide, cursive'}>
                        NoirSpace Messenger
                    </Typography>
                    {children}
                </Paper>
            </Container>
        </Box>
    );
}
