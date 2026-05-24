import { Box, Container } from "@mui/material";
import ForgotPasswordForm from "../../components/authentication/ForgotPasswordForm";

/**
 * A route that provides the form for a user to reset their password by initiating
 * the one-time password reset process.
 *
 * @returns {@mui.material.Container}
 */
const ForgotPassword = () => {
  return (
    <Container
      variant="gradient"
      maxWidth={false}
      sx={{
        width: "100vw",
        minHeight: "100vh",
        padding: "0",
        margin: "0",
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "center",
      }}
    >
      <Box variant="gradient">
        <ForgotPasswordForm />
      </Box>
    </Container>
  );
};

export default ForgotPassword;
