import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import LockResetIcon from "@mui/icons-material/LockReset";
import Logo from "../../assets/WellAiLogoTR.png";
import PasswordInputField from "../authentication/PasswordInputField";

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
      (!primary_password && !secondary_password)
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
    await fetch(`${API_BASE}/password-reset`, {
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
    <Card
      sx={{
        alignItems: "center",
        width: { xs: "auto", sm: "500px" },
        minHeight: { xs: "100vh", sm: "auto" },
        flexGrow: { xs: 1, sm: 0 },
      }}
    >
      <CardContent>
        {/* Input form */}
        {!isFormSubmitted && (
          <Stack
            spacing={{ xs: 5 }}
            pl={3}
            pr={3}
            style={{ justifyContent: "center" }}
          >
            <Stack spacing={{ xs: 1 }}>
              <Stack alignItems="center">
                <Box
                  component="img"
                  alt="Well AI Logo"
                  src={Logo}
                  sx={{ width: "10em", paddingBottom: "30px" }}
                />
              </Stack>
              <Stack alignItems="center">
                <LockResetIcon alignItem="center" sx={{ fontSize: 80 }} />
              </Stack>
              <Typography variant="h4" align="center">
                Reset Password
              </Typography>
              <Typography align="start" variant="subtle">
                Enter your new password below and submit to update your
                password.
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
                <Divider />
                <Button
                  href="/login"
                  variant="outlined"
                  sx={{
                    py: { xs: "1rem", sm: ".9rem" },
                    fontSize: "1rem",
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Stack>
        )}

        {/* Success response */}
        {isFormSubmitted && (
          <Stack spacing={{ xs: 5 }} pl={3} pr={3}>
            <Stack spacing={{ xs: 1, position: "relative" }}>
              <Stack alignItems="center">
                <Box
                  component="img"
                  alt="Well AI Logo"
                  src={Logo}
                  sx={{ width: "10em", paddingBottom: "30px" }}
                />
              </Stack>
              <Stack alignItems="center">
                <CheckIcon alignItem="center" sx={{ fontSize: 80 }} />
              </Stack>
              <Typography variant="h4" align="center">
                Password Change Successful!
              </Typography>
              <Typography align="start" variant="subtle" display="inline">
                Your password has been updated successfully. You can now login
                to your account with your new password.
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
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
