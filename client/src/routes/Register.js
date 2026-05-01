import { Container } from "@mui/material";
import RegistrationForm from "../components/authentication/RegistrationForm";

/**
 * A page used to display registration information and provide a form to allow
 * users to register.
 */
const Register = () => {
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
      <RegistrationForm />
    </Container>
  );
};

export default Register;
