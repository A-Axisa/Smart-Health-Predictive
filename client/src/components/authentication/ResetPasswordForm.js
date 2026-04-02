import { Container } from "@mui/material";
import {
  Container,
  Stack,
  Typography,
} from "@mui/material";

/**
 * Provides a form to reset their password one time with a reset token.
 */
const ResetPasswordForm = () => {
  return (
    <Container
      sx={{
        borderRadius: { xs: 0, sm: 2 },
        padding: "40px",
        alignItems: "center",
        boxShadow: 24,
        backgroundColor: "#ffffff",
        width: { xs: "auto", sm: "500px" },
        flexGrow: { xs: 1, sm: 0 },
      }}
    >
      {/* Password form */}
      <Stack
        direction="column"
        spacing={{ xs: 5 }}
        pl={3}
        pr={3}
        style={{ justifyContent: "center" }}
      >
        <Stack direction="column" spacing={{ xs: 2 }}>
          <h1>Account Recovery</h1>
          <Typography align="start" style={{ color: "#777777" }}>
            Enter your new password below and submit to update your password
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ResetPasswordForm;
