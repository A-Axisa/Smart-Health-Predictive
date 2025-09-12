import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

// Centralized MUI theme for the app
export const appTheme = createTheme({
  palette: {
    primary: { main: '#127067' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'uppercase', fontWeight: 600 },
        containedPrimary: {
          backgroundColor: '#127067',
          '&:hover': { backgroundColor: '#0f5a52' },
        },
        outlinedPrimary: {
          borderColor: '#127067',
          color: '#127067',
          '&:hover': {
            borderColor: '#0f5a52',
            backgroundColor: 'rgba(18,112,103,.06)'
          },
        },
      },
    },
  },
});

const AppThemeProvider = ({ children }) => (
  <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
