'use client';

import { useState } from "react";
import Box from "@mui/material/Box";
import Footer from "../components/Footer/Footer";
import Header from "../components/Heared/Header";
import { Sidebar } from "../features/sidebar/Sidebar";
import BgImg from '../../../public/bg.jpg';

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(300);

  return (
    <Box
      display="flex"
      minHeight="100vh"
    >
      <Sidebar onWidthChange={setSidebarWidth} />

      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        minHeight="100vh"
        marginLeft={`${sidebarWidth}px`}
      >
        <Header />
        <Box 
          component="main"
          flex={1}
          sx={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${BgImg.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: 0.4,
              zIndex: 0,
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
            {children}
          </Box>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
