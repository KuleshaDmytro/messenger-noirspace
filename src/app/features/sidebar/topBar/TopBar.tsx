import React, { useCallback, useState } from 'react';

import { Box, IconButton, LinearProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import SettingsMenu from '../settingsMenu/SettingsMenu';
import ShadowLine from '@/app/components/ShadowLine/ShadowLine';
import SearchField from '../searchField/SearchField';

const TopBar: React.FC = () => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ position: "relative" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    bgcolor: "#1E1E1E",
                    height: "64px",
                }}
            >
                <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                        color: "white",
                        mr: 2,
                    }}
                    >
                    <MenuIcon />
                </IconButton>

                <SearchField />
            </Box>

            <SettingsMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            />

            <ShadowLine />
        </Box>
    );
};

export default TopBar;