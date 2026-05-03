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
import RequestPatientAccessForm from "../components/RequestPatientAccessForm";

/**
 * Displays the form to reset a user's password if it has been forgotten.
 */
const RequestPatientAccess = () => {
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
        <RequestPatientAccessForm />
      </Box>
    </Container>
  );
};

export default RequestPatientAccess;
