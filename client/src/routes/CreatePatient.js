import { Box } from "@mui/material";
import CreatePatientForm from "../components/authentication/CreatePatientForm";

// AppBar height: 56px toolbar + 2px border on mobile (xs), 64px + 2px on desktop (sm+)
const APPBAR_HEIGHT = { xs: "58px", sm: "66px" };
const DRAWER_WIDTH = "65px";

/**
 * A page used to create a new patient record.
 */
const CreatePatient = () => {
  return (
    <Box
      sx={{
        ml: DRAWER_WIDTH,
        mt: APPBAR_HEIGHT,
        minHeight: {
          xs: `calc(100vh - 58px)`,
          sm: `calc(100vh - 66px)`,
        },
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "center",
        py: { xs: 4, sm: 6 },
        boxSizing: "border-box",
      }}
    >
      <CreatePatientForm />
    </Box>
  );
};

export default CreatePatient;
