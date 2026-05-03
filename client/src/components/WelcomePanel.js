import { Box, Container, Stack, Typography } from "@mui/material";
import Logo from "../assets/WellAiLogoTR.png";

/**
 * An panel that introduce the web service.
 */
const WelcomePanel = () => {
  return (
    <Container>
      <Stack
        direction={{
          xs: "column-reverse",
          sm: "column-reverse",
          md: "column-reverse",
          lg: "column",
        }}
        alignItems="center"
        spacing={10}
      >
        <Stack alignItems="center" spacing={1}>
          <Typography variant="h3" align="center">
            Smart Health Predictive
          </Typography>
          <Typography variant="h7" maxWidth="500px" sx={{ px: 5 }}>
            Smart Health Predictive empowers individuals to take control of
            their well-being through data-driven insights. Using AI-powered
            health analytics, WellAI helps you understand potential health risks
            early and make informed lifestyle choices for a better, healthier
            future.
          </Typography>
        </Stack>
        <Stack alignItems="center">
          <Box
            component="img"
            alt="Well AI Logo"
            src={Logo}
            sx={{ width: "20em" }}
            paddingTop="40px"
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default WelcomePanel;
