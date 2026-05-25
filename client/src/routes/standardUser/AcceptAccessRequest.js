import { Box, Container } from "@mui/material";
import AcceptRequestForm from "../../components/patientAccessRequest/AcceptRequestForm";

/**
 * A page that displays the accept access request form for users to
 * accept requests from merchants.
 *
 * @returns {@mui.material.Container}
 */
const AcceptAccessRequest = () => {
  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        display: "flex",
        ml: "65px",
        mt: "66px",
      }}
    >
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
    </Box>
  );
};

export default AcceptAccessRequest;
