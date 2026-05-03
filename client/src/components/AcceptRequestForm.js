import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Button,
  Typography,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Provides the user a form to request a password reset using their email.
 */
const AcceptRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { token } = useParams();

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    await fetch(`${API_BASE}/patient-accept-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Request has expired or is invalid");
          return;
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
            <Typography variant="h4" fontWeight={600}>
              Partner Access Request
            </Typography>
            <Typography align="start">
              You have received a request from one of our partner's to access
              your patient record. This will allow the partner to:
            </Typography>
            <List
              sx={{
                pl: 2,
                "& .MuiListItem-root::before": {
                  content: '"•"',
                  marginRight: "10px",
                },
              }}
            >
              <ListItem disablePadding>
                <ListItemText primary="View your health report history" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary="Generate new health reports based on your data" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary="View your health data" />
              </ListItem>
            </List>
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
          </Stack>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={{ xs: 2 }}>
              <Button
                loading={isLoading}
                type="submit"
                variant="contained"
                sx={{
                  py: { xs: "1rem", sm: ".9rem" },
                  fontSize: { xs: "1.2rem", sm: "1rem" },
                }}
              >
                Accept Request
              </Button>
            </Stack>
          </Box>
          <Link
            component={RouterLink}
            to="/landing"
            align="end"
            fontWeight="bold"
          >
            Return to dashboard
          </Link>
        </Stack>
      )}

      {/* Success response */}
      {isFormSubmitted && (
        <Stack direction="column" spacing={{ xs: 5 }} pl={3} pr={3}>
          <Stack direction="column" spacing={{ xs: 2, position: "relative" }}>
            <h1>Request Successful</h1>
            <Typography align="start" style={{ color: "#777777" }}>
              You have successfully accept this request.
            </Typography>
          </Stack>
          <Button
            component={RouterLink}
            to="/landing"
            variant="outlined"
            sx={{
              py: { xs: "1rem", sm: ".9rem" },
              fontSize: { xs: "1.2rem", sm: "1rem" },
            }}
          >
            Return to Dashboard
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default AcceptRequestForm;
