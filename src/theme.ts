// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#28446B', // Brand blue
    },
    secondary: {
      main: '#444245', // Brand gray
    },
    error: {
      main: '#B00020',
    },
    warning: {
      main: '#ffa000',
    },
    success: {
      main: '#43a047',
    },
    background: {
      default: '#F4F4F4', // Your background color
    },
  },
  shape: {
    borderRadius: 12, // Example: rounded corners
  },
  typography: {
    fontFamily: 'hind',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
  // You can add more customizations here
});

export default theme;