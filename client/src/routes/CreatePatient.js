import { Box, Container } from "@mui/material";
import CreatePatientForm from "../components/authentication/CreatePatientForm";

/**
 * A page used to create a new patient record.
 */
const CreatePatient = () => {
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
      <Box
        variant="gradient"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          py: { xs: 4, sm: 6 },
        }}
      >
        <CreatePatientForm />
      </Box>
    </Container>
  );
};

export default CreatePatient;
