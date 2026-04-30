'use client'
import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Space_Grotesk } from 'next/font/google';
import { ErrorBanner } from '../Error/ErrorBanner';
import { signOut } from 'next-auth/react';
import { useApolloClient } from '@apollo/client';
import { Button } from '@mui/material';

const spaceGrotesk = Space_Grotesk({ 
    subsets: ['latin'], 
    weight: ['400', '700'],
    variable: '--font-space-grotesk',
});

const Header = () => {
    const client = useApolloClient();

    const handleClick = async () => {
        await client.clearStore();

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        await signOut({ 
            callbackUrl: "/sign-in",
            redirect: true 
        });
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#0D0D0D',
                width: '100%',
            }}
        >
            <Toolbar>

            <ErrorBanner />
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant="h5"
                    >
                        <span
                            style={{
                                fontFamily: 'Audiowide',
                                fontWeight: 'regular',
                                userSelect: 'none',
                            }}
                        >
                            Noir Space
                        </span>
                        </Typography>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button
                        style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            marginLeft: 1,
                            marginRight: 1,
                            transition: 'background 0.2s, color 0.2s'
                        }}
                        onClick={handleClick}
                    >
                        <Typography
                            variant="body2"
                            fontSize={14}
                            className={spaceGrotesk.className}
                            sx={{
                                fontWeight: 400,
                                '&:hover': {
                                    color: '#FFD700',
                                },
                                cursor: 'pointer'
                            }}
                        >
                             SIGN OUT
                        </Typography>
                    </Button>
                </Box>
            </Box>
              
            </Toolbar>
        </AppBar>
    );
};

export default Header;