import { Container } from "@mui/material";
import CreatePatientForm from "../components/authentication/CreatePatientForm";

/**
 * A page used to create a new patient record.
 */
const CreatePatient = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100vw",
        height: "100dvh",
        padding: "0",
        margin: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CreatePatientForm />
    </Container>
  );
};

export default CreatePatient;
