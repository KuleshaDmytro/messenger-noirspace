import React from 'react';
import { Box, Typography } from '@mui/material'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const Footer: React.FC = () => {
    return (
        <footer>
            <Box
            sx={{
                width: `100%`,
                padding: '1rem 0',
                textAlign: 'center',
                bgcolor: '#0D0D0D',
                color: 'common.white',
            }}
            component="footer"
            >
            <Typography
                className={spaceGrotesk.className}
                fontSize={14}
                sx={{ fontWeight: 500 }}
            >
                &copy; {new Date().getFullYear()} Messenger NoirSpace. All rights reserved.
            </Typography>
            </Box>
        </footer>
    );
};

export default Footer;