import {
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/WellAiLogoTR.png";


const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Stack
      spacing={6}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        textAlign: "center",
        background: {
          xs: "#ffffff",
          sm: "linear-gradient(to top left, #e0e0e0, #ffffff)",
        },
      }}
    >
      <Box>
        <Box
          component="img"
          alt="WellAI Logo"
          src={Logo}
          sx={{ height: 50, mb: 3 }}
        />
        <Typography
          variant="h3"
        >
          Error 404
        </Typography>
        <Typography
          variant="h6"
          sx={{
            overflow: "hidden",
            px: { xs: 2, sm: 8 },
            wordBreak: "break-word"
          }}
        >
          The requested URL cannot be found.
        </Typography>
      </Box>
      <Button
        onClick={() => navigate(-1)}
        variant="contained"
        size="large"
      >
        Go Back
      </Button>
    </Stack>
  );
};
export default ErrorPage;
