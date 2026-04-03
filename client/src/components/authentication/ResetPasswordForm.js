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
import { useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Provides a form to reset their password one time with a reset token.
 */
const ResetPasswordForm = () => {
  const { token } = useParams();
  const [alertPasswordRequired, setAlertPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(null);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordsMatching, setIsPasswordsMatching] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  function validatePassword(e) {
    setAlertPasswordRequired(false);
    setIsPasswordValid(e.isValid);
    setPassword(e.password);
    setIsPasswordsMatching(doPasswordsMatch(e.password, confirmPassword));
  }

  function updateConfirmPassword(e) {
    const confirmPasswordInput = e.target.value;
    setConfirmPassword(confirmPasswordInput);
    setIsPasswordsMatching(doPasswordsMatch(password, e.target.value));
  }

  function doPasswordsMatch(primary_password, secondary_password) {
    return (
      (primary_password &&
        secondary_password &&
        primary_password === secondary_password) ||
      (!primary_password &&
        !secondary_password)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isPasswordValid || !isPasswordsMatching) {
      setAlertPasswordRequired(password === null);
      return;
    }

    setIsLoading(true);

    // Post the fetch request with the supplied credentials.
    await fetch(`${API_BASE}/passwordReset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        password: password,
      }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        setIsFormSubmitted(true);
        return response.json();
      })
      .catch((_error) => {});

    setIsLoading(false);
  }

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
      {!isFormSubmitted && (
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
                error={!isPasswordsMatching && password !== null}
                helperText={
                  !isPasswordsMatching && password !== null
                    ? "*Passwords do not match"
                    : null
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
      )}

      {/* Success response */}
      {isFormSubmitted && (
        <Stack direction="column" spacing={{ xs: 5 }} pl={3} pr={3}>
          <Stack direction="column" spacing={{ xs: 2, position: "relative" }}>
            <h1>Password Successfully Changed </h1>
            <Typography align="start" style={{ color: "#777777" }}>
              Your password has been updated successfully. You can now login to
              your account with your new password.
            </Typography>
          </Stack>
          <Button
            href="/login"
            variant="outlined"
            sx={{
              py: { xs: "1rem", sm: ".9rem" },
              fontSize: { xs: "1.2rem", sm: "1rem" },
            }}
          >
            Go to Login
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default ResetPasswordForm;
