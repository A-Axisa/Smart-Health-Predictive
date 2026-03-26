import {
  Box,
  Typography,
  Container,
} from "@mui/material";


const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const AdministratorDashboard = () => {
  return (
    <Box
      sx={{
        ml: "250px",
        mt: "66px",
      }}
    >
      <Typography>
        Admin Dashboard
      </Typography>
    </Box>
  );
};

export default AdministratorDashboard;
