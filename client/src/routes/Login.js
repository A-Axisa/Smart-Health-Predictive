import { Box, Container, Stack, Typography } from "@mui/material";
import LoginForm from "../components/authentication/LoginForm";
import Logo from "../assets/WellAiLogoTR.png";
import WelcomePanel from "../components/WelcomePanel";
import { alignItems, width } from "@mui/system";

/**
 * Introduces the services and provides forms for logging in to
 * the service.
 */
const Login = () => {
  return (
    <Box
      alignContent="center"
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        background: {
          xs: "#ffffff",
          sm: "linear-gradient(to top left, #e0e0e0, #ffffff)",
        },
      }}
    >
      <Stack alignItems="center">
        <Stack
          direction={{
            sm: "column",
            md: "column",
            lg: "row",
          }}
          spacing={{ xs: 5, sm: 5, md: 5, lg: 0, xl: 0 }}
          alignItems={{ sm: "center", md: "center", lg: "center" }}
        >
          <WelcomePanel />
          <LoginForm />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Login;
