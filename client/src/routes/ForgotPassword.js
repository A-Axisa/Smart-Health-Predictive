import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Link,
  Divider,
} from "@mui/material";
import ForgotPasswordForm from "../components/authentication/ForgotPasswordForm";

/**
 * Displays the form to reset a user's password if it has been forgotten.
 */
const ForgotPassword = () => {
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
      <ForgotPasswordForm />
    </Container>
  );
};

export default ForgotPassword;
