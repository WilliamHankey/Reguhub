import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#28446B',
    },
    secondary: {
      main: '#444245',
    },
    error: {
      main: '#B00020',
    },
    warning: {
      main: '#FFA000',
    },
    success: {
      main: '#43A047',
    },
    background: {
      default: '#F9F9FA',
      paper: '#FFF',
    },
    divider: '#E0E0E0',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
}); 