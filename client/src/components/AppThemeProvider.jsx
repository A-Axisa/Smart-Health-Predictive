import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/russo-one';

// Centralized MUI theme for the app
export const appTheme = createTheme({
  shape: {
    borderRadius: 20,
  },
  palette: {
    primary: { main: 'rgb(113, 43, 135)' },
    secondary: { main: 'rgb(66, 118, 56)' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          fontFamily: '"Russo One", sans-serif',
          borderRadius: 12,
        },
        outlined: {
          borderColor: 'rgb(66, 118, 56)',
          color: 'rgb(66, 118, 56)',
          '&:hover': {
            borderColor: 'rgb(53, 94, 45)',
            backgroundColor: 'rgba(66,118,56,.08)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const AppThemeProvider = ({ children }) => (
  <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
