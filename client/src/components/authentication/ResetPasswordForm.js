import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Button,
  Typography,
  Link,
  TextField,
} from "@mui/material";
import PasswordInputField from "../authentication/PasswordInputField";

/**
 * Provides a form to reset their password one time with a reset token.
 */
const ResetPasswordForm = () => {
  const [alertPasswordRequired, setAlertPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(null);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertPasswordsDontMatch, setAlertPasswordsDontMatch] = useState(false);

  function validatePassword(e) {
    setAlertPasswordRequired(false);
    setIsPasswordValid(e.isValid);
    setPassword(e.password);
  }

  function updateConfirmPassword(e) {
    const confirmPasswordInput = e.target.value;
    setConfirmPassword(confirmPasswordInput);
    setAlertPasswordsDontMatch(
      confirmPasswordInput !== password || confirmPasswordInput === "",
    );
  }

  async function handleSubmit(e) {}

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
      {/* Input form */}
      <Stack
        direction="column"
        spacing={{ xs: 5 }}
        pl={3}
        pr={3}
        style={{ justifyContent: "center" }}
      >
        <Stack direction="column" spacing={{ xs: 2 }}>
          <h1>Reset Password</h1>
          <Typography align="start" style={{ color: "#777777" }}>
            Enter your new password below and submit to update your password.
          </Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2 }}>
            <PasswordInputField
              onChange={validatePassword}
              truncate={true}
              showRequired={alertPasswordRequired}
            />
            <TextField
              id="outlined-password-input"
              label="Confirm Password"
              onChange={updateConfirmPassword}
              type="password"
              error={alertPasswordsDontMatch}
              helperText={
                alertPasswordsDontMatch ? "*Passwords do not match" : null
              }
            ></TextField>
            <Button
              loading={isLoading}
              type="submit"
              variant="contained"
              sx={{
                py: { xs: "1rem", sm: ".9rem" },
                fontSize: { xs: "1.2rem", sm: "1rem" },
              }}
            >
              Submit
            </Button>
          </Stack>
        </Box>
        <Link href="/login" align="end" fontWeight="bold">
          Cancel
        </Link>
      </Stack>
    </Container>
  );
};

export default ResetPasswordForm;
