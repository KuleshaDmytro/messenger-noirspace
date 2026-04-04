import React from 'react';

import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import SettingsMenu from '../settingsMenu/SettingsMenu';
import ShadowLine from '@/app/components/ShadowLine/ShadowLine';
import SearchField from '../searchField/SearchField';
import { useSidebarContext } from '@/app/hooks/useSidebarContext';

const TopBar: React.FC = () => {

    const { handleMenuOpen } = useSidebarContext();
    
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

            <SettingsMenu/>

            <ShadowLine />
        </Box>
    );
};

export default TopBar;