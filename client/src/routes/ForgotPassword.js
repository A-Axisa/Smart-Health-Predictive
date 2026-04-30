import { Box, Container } from "@mui/material";
import ForgotPasswordForm from "../components/authentication/ForgotPasswordForm";

/**
 * Displays the form to reset a user's password if it has been forgotten.
 */
const ForgotPassword = () => {
  return (
    <Container
      variant="gradient"
      maxWidth={false}
      sx={{
        width: "100vw",
        height: "100vh",
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
