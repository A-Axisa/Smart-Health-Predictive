import { Typography, Button, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/WellAiLogoTR.png";

/**
 * A page that is displayed when a user tried to navigate a non-existent
 * or malformed route.
 *
 * @returns {@mui.material.Container}
 */
const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Stack
      spacing={7}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        textAlign: "center",
        background: {
          xs: "#ffffff",
          sm: "linear-gradient(to top left, #e0e0e0, #ffffff)",
        },
      }}
    >
      <Box>
        <Typography variant="h2" sx={{ fontWeight: 500 }}>
          Error 404
        </Typography>
        <Typography
          variant="h6"
          sx={{
            overflow: "hidden",
            px: { xs: 2, sm: 8 },
            wordBreak: "break-word",
          }}
        >
          The requested URL cannot be found.
        </Typography>
      </Box>
      <Button onClick={() => navigate(-1)} variant="contained" size="large">
        Go Back
      </Button>
    </Stack>
  );
};
export default ErrorPage;
