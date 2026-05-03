import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Stack, Button, Typography, Link } from "@mui/material";
import EmailInputField from "./authentication/EmailInputField";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Provides the user a form to request a password reset using their email.
 */
const RequestPatientAccessForm = () => {
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
    await fetch(`${API_BASE}/patient-request`, {
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
            <h1>Request Access to Existing Patient Record</h1>
            <Typography align="start" style={{ color: "#777777" }}>
              Enter the email of the patient you are requesting access for.
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
                Request Access
              </Button>
            </Stack>
          </Box>
          <Link
            component={RouterLink}
            to="/patient-management"
            align="end"
            fontWeight="bold"
          >
            Return to Patient Management
          </Link>
        </Stack>
      )}

      {/* Success response */}
      {isFormSubmitted && (
        <Stack direction="column" spacing={{ xs: 5 }} pl={3} pr={3}>
          <Stack direction="column" spacing={{ xs: 2, position: "relative" }}>
            <h1>Request Successful</h1>
            <Typography align="start" style={{ color: "#777777" }}>
              We have sent an email to the patient email address with
              instructions to accept the request.
            </Typography>
            <Typography align="start" style={{ color: "#777777" }}>
              If the patient is unable to view the request, please ask them to
              check their spam folder.
            </Typography>
          </Stack>
          <Button
            component={RouterLink}
            to="/patient-management"
            variant="outlined"
            sx={{
              py: { xs: "1rem", sm: ".9rem" },
              fontSize: { xs: "1.2rem", sm: "1rem" },
            }}
          >
            Return to patient management
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default RequestPatientAccessForm;
