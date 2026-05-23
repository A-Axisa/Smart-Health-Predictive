import { Container } from "@mui/material";
import RegistrationForm from "../components/authentication/RegistrationForm";

/**
 * A page that displays the registration form.
 *
 * @returns {@mui.material.Container}
 */
const Register = () => {
  return (
    <Container
      variant="gradient"
      maxWidth={false}
      sx={{
        width: "100%",
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
