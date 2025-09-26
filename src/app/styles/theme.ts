// styles/theme.ts
import { createTheme } from '@mui/material/styles';
// import '@fontsource/audiowide';
// import '@fontsource/space-grotesk';

declare module '@mui/material/styles' {

  interface PaletteOptions {
    sendIcon?: string;
  }
}

const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#FFD700',
      },
      background: {
        default: mode === 'dark' ? '#1A1A1A' : '#fafafa',
        paper: mode === 'dark' ? '#121212' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#222222',
        secondary: mode === 'dark' ? '#aaaaaa' : '#555555',
      },
      // Додаємо кастомний колір для іконки SendIcon
      sendIcon: mode === 'dark' ? '#fafafa' : '#121212',
    },
    typography: {
      fontFamily: `'Space Grotesk', sans-serif`,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            transition: 'all 0.3s',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'all 0.3s',
          },
        },
      },
    },
  });

const theme = getTheme('dark');

export default theme;


export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFD700',
      light: '#FFE066',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',      
    },
    text: {
      primary: '#222222',
      secondary: '#555555',
      disabled: '#AAAAAA',
    },
    sendIcon: '#121212',
  },
  transitions: {
    duration: {
      standard: 300,
      short: 200,
      enteringScreen: 250,
      leavingScreen: 200,
    },
  },
  typography: {
    fontFamily: `'Space Grotesk', sans-serif`,
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700',
      light: '#FFE066',
    },
    background: {
      default: '#1A1A1A',
      paper: '#121212', 
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
      disabled: '#555555',
    },
    sendIcon: '#fafafa',
  },
  transitions: {
    duration: {
      standard: 300, 
      short: 200,
      enteringScreen: 250,
      leavingScreen: 200,
    },
  },
  typography: {
    fontFamily: `'Space Grotesk', sans-serif`,
  },
});
