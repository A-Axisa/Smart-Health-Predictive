import { useState } from "react";
import { Box, Container, Stack, Button, Typography, Link } from "@mui/material";
import EmailInputField from "./EmailInputField";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Provides the user a form to request a password reset using their email.
 */
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [alertEmailRequired, setAlertEmailRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  function validateEmail(e) {
    setAlertEmailRequired(false);
    setIsEmailValid(e.isValid);
    setEmail(e.email.trim());
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Only accept emails structured correctly.
    if (!isEmailValid) {
      setAlertEmailRequired(email === null);
      return;
    }

    setIsLoading(true);
    await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
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
            <h1>Forgot Password?</h1>
            <Typography align="start" style={{ color: "#777777" }}>
              Enter the email associated with your WellAI account and we'll send
              you an email that will allow you to reset your password
            </Typography>
          </Stack>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={{ xs: 2 }}>
              <EmailInputField
                onChange={validateEmail}
                showRequired={alertEmailRequired}
              />
              <Button
                loading={isLoading}
                type="submit"
                variant="contained"
                sx={{
                  py: { xs: "1rem", sm: ".9rem" },
                  fontSize: { xs: "1.2rem", sm: "1rem" },
                }}
              >
                Reset Password
              </Button>
            </Stack>
          </Box>
          <Link href="/login" align="end" fontWeight="bold">
            Return to Login
          </Link>
        </Stack>
      )}

      {/* Success response */}
      {isFormSubmitted && (
        <Stack direction="column" spacing={{ xs: 5 }} pl={3} pr={3}>
          <Stack direction="column" spacing={{ xs: 2, position: "relative" }}>
            <h1>Request Successful</h1>
            <Typography align="start" style={{ color: "#777777" }}>
              We have sent an email to your email address with instruction to
              reset your password and should appear shortly.
            </Typography>
            <Typography align="start" style={{ color: "#777777" }}>
              If you do not see the it, check your spam folder.
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
            Return to login
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default ForgotPasswordForm;
