import { Paper } from "@mui/material";
import { ReactNode } from "react";

type OverlayPaperProps = {
  children: ReactNode;
};
export const OverlayMenuPaper: React.FC<OverlayPaperProps> = ({ children }) => {
    return (
        <Paper
            sx={{
                position: "absolute",
                top: "90%",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                borderRadius: "0 0 12px 12px",
                height: '100vh',
                overflowY: "auto",
                color: "white",
                mt: 0.5,
                bgcolor: "rgba(30, 30, 30, 0.7)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "all 0.8s ease",
            }}
            elevation={3}
        >
            {children}
        </Paper>
    );
};
