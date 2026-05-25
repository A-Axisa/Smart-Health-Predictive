import { Box, Container } from "@mui/material";
import RequestPatientAccessForm from "../../components/patientAccessRequest/RequestPatientAccessForm";

/**
 * A page that displays the form to request access to a patients record.
 *
 * @returns {@mui.material.Box}
 */
const RequestPatientAccess = () => {
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
          <RequestPatientAccessForm />
        </Box>
      </Container>
    </Box>
  );
};

export default RequestPatientAccess;
