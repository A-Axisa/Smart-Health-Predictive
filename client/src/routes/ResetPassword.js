import { Container } from "@mui/material";
import ResetPasswordForm from "../components/authentication/ResetPasswordForm";

/**
 * Displays the form to reset a user's password if it has been forgotten.
 */
const ResetPassword = () => {
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
        flexGrow: 1,
      }}
    >
      <ResetPasswordForm />
    </Container>
  );
};

export default ResetPassword;
