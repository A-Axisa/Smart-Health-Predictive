import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Link,
  Divider,
} from "@mui/material";
import ResetPasswordForm from "../components/authentication/ResetPasswordForm";

/**
 * Displays the form to reset a user's password if it has been forgotten.
 */
const ResetPassword = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: "#127067",
        width: "100vw",
        height: "100dvh",
        padding: "0",
        margin: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ResetPasswordForm />
    </Container>
  );
};

export default ResetPassword;
