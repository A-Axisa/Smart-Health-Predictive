import { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
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
    <Card
      sx={{
        alignItems: "center",
        width: { xs: "auto", sm: "500px" },
        height: { xs: "100vh", sm: "auto" },
        flexGrow: { xs: 1, sm: 0 },
      }}
    >
      <CardContent>
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
              <Stack alignItems="center">
                <PsychologyAltIcon alignItem="center" sx={{ fontSize: 80 }} />
              </Stack>
              <Typography variant="h4" align="center">
                Forgot Password?
              </Typography>
              <Typography variant="subtle" align="start">
                Enter the email associated with your WellAI account and we'll
                send you an email that will allow you to reset your password
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
                    fontSize: "1rem",
                  }}
                >
                  Reset Password
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
                  Return to Login
                </Button>
              </Stack>
            </Box>
          </Stack>
        )}

        {/* Success response */}
        {isFormSubmitted && (
          <Stack direction="column" spacing={5} pl={3} pr={3}>
            <Stack direction="column" spacing={{ xs: 2, position: "relative" }}>
              <Stack alignItems="center">
                <ForwardToInboxOutlinedIcon sx={{ fontSize: 80 }} />
              </Stack>
              <Typography variant="h4" align="center">
                Request Successful!
              </Typography>
              <Typography align="start" style={{ color: "#777777" }}>
                We have sent an email to your email address with instruction to
                reset your password and should appear shortly.
              </Typography>
              <Typography align="start" style={{ color: "#777777" }}>
                If you do not see the the email, check your spam folder.
              </Typography>
            </Stack>
            <Button
              href="/login"
              variant="outlined"
              sx={{
                py: { xs: "1rem", sm: ".9rem" },
                fontSize: "1rem",
              }}
            >
              Return to login
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
