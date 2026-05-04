import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Link,
  Divider,
} from "@mui/material";
import AcceptRequestForm from "../components/AcceptRequestForm";

/**
 * Displays the form to accept an access request
 */
const AcceptAccessRequest = () => {
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
        <AcceptRequestForm />
      </Box>
    </Container>
  );
};

export default AcceptAccessRequest;
