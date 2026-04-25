import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/russo-one";
import { color } from "@mui/system";

// Centralized MUI theme for the app
export const appTheme = createTheme({
  shape: {
    borderRadius: 20,
  },
  palette: {
    primary: {
      main: "rgb(113, 43, 135)",
      dark: "rgb(93, 23, 115)",
      light: "rgb(133, 63, 155)",
    },
    secondary: {
      main: "rgb(66, 118, 56)",
      dark: "rgb(53, 94, 45)",
      light: "rgb(86, 138, 76)",
    },
    background: { main: "rgb(239, 239, 239)" },
    paper: { main: "rgb(255, 255, 255)" },
    invisible: { main: "rgb(0, 0, 0, 0)" },
  },
  typography: {
    fontFamily: ["Arial", "sans-serif"].join(","),
  },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 600,
          fontFamily: "'Russo One', 'sans-serif'",
        },
        outlined: {
          borderColor: "secondary",
          color: "secondary",
          "&:hover": {
            borderColor: "primary.dark",
            backgroundColor: "rgba(113, 43, 135, 0.25)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "paper",
          borderColor: "invisible",
          padding: "20px",
        },
      },
    },
    MuiBox: {
      variants: [
        {
          props: { variant: "gradient" },
          style: {
            backgroundImage: "linear-gradient(to top left, #e0e0e0, #ffffff)",
          },
        },
        {
          props: { variant: "background" },
          style: {
            backgroundColor: "background",
          },
        },
      ],
    },
    MuiPaper: {
      defaultProps: {
        elevation: 16,
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Arial', 'sans-serif'",
        },
        subtle: {
          color: "#888888",
          fontFamily: "'Arial', 'sans-serif'",
        },
        h1: {
          fontWeight: 600,
          fontFamily: "'Russo One', 'sans-serif'",
        },
        h2: {
          fontWeight: 600,
          fontFamily: "'Russo One', 'sans-serif'",
        },
        h3: {
          fontWeight: 600,
          fontFamily: "'Russo One', 'sans-serif'",
        },
      },
    },
  },
});

const AppThemeProvider = ({ children }) => (
  <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
