import React from "react";
import Box from "@mui/material/Box";

const ShadowLine: React.FC = () => (
    <Box
        sx={{
            height: "1px",
            background:
                "linear-gradient(to right, rgba(0,0,0,0.3), rgba(255,255,255,0.03), rgba(0,0,0,0.3))",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.8)",
            width: "100%",
        }}
    />
);

export default ShadowLine;