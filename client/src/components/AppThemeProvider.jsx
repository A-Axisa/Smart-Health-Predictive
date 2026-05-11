import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/russo-one";
import { color, fontWeight } from "@mui/system";

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
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "paper",
          borderColor: "invisible",
          padding: "20px",
        },
      },
    },
    MuiContainer: {
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
      variants: [
    {
      props: { variant: "report-section" },
      style: ({ theme }) => ({
        borderRadius: 0,
        marginInline: theme.spacing(2),
        padding: theme.spacing(2),
        boxShadow: theme.shadows[3],
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  ],
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
        h4: {
          fontWeight: 'regular',
          fontFamily: "'Russo One', 'sans-serif'",
        },
        h5: {
          fontWeight: 'regular',
          fontFamily: "'Russo One', 'sans-serif'",
        },
        h7: {
          fontWeight: 'regular',
          fontFamily: "'Russo One', 'sans-serif'",
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        pageSizeOptions: [25, 50, 99],
        disableColumnResize: true,
        disableRowSelectionOnClick: true,
        autoHeight: false,
        density: "standard",
        autoHeight: false,
      },
      styleOverrides: {
        root: {
          border: 0,
          p: 1,
          borderRadius: 12,
          overflow: "hidden",
          minWidth: 900,
        },
        columnHeaders: {
          backgroundColor: "rgb(239, 239, 239)",
          borderBottom: "1px solid rgb(239, 239, 239)",
        },
        columnHeader: {
          backgroundColor: "rgb(239, 239, 239)",
          "&:focus, &:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-sortIcon": {
            opacity: 'inherit !important',
          },
          "& .MuiDataGrid-iconButtonContainer": {
              visibility: 'visible',
          },
        },
        filler: {
          backgroundColor: "rgb(239, 239, 239)",
        },
        columnSeparator: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        cell: {
          borderBottom: "1px solid rgb(239, 239, 239)",
          whiteSpace: "normal",
          alignItems: "flex-start",
          py: 1,
          "&:focus, &:focus-within": {
            outline: "none",
          },
        },
        row: {
          "&:hover": {
            backgroundColor: "rgb(239, 239, 239, 0.5)",
          },
        },
        footerContainer: {
          borderTop: "1px solid rgb(239, 239, 239)",
          backgroundColor: "rgb(255, 255, 255)",
        },
        virtualScroller: {
          backgroundColor: "rgb(255, 255, 255)",
        },
      },
    },
  },
});

const AppThemeProvider = ({ children }) => (
  <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
