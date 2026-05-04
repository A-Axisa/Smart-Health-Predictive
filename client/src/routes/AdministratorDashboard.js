import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import ActiveMerchantsAnalytics from "../components/administrator/analytics/ActiveMerchantsAnalytics";
import ActiveUsersAnalytics from "../components/administrator/analytics/ActiveUsersAnalytics";
import AverageRiskSeriesAnalytics from "../components/administrator/analytics/AverageRiskSeriesAnalytics";
import LoginActivityAnalytics from "../components/administrator/analytics/LoginActivityAnalytics";
import PendingMerchantsAnalytics from "../components/administrator/analytics/PendingMerchantsAnalytics";
import RecentReportsGeneratedAnalytics from "../components/administrator/analytics/RecentReportsGeneratedAnalytics";
import UnvalidatedAccountAnalytics from "../components/administrator/analytics/UnvalidatedAccountAnalytics";
import UserAccountAnalytics from "../components/administrator/analytics/UserAccountAnalytics";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const AdministratorDashboard = () => {
  return (
    <Container
      maxWidth={false}
      variant="gradient"
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          pl: "250px",
          mr: "-25px",
          pr: "20px",
          pt: "90px",
          pb: "20px",
        }}
      >
        <Stack spacing={{ xs: 2, sm: 3, md: 5, lg: 5 }}>
          <Stack spacing={1}>
            <Typography
              variant="h3"
              sx={{
                fontSize: {
                  xs: "2em",
                  sm: "2em",
                  md: "3em",
                  lg: "3em",
                },
              }}
            >
              Admin Dashboard
            </Typography>
            <Divider />
          </Stack>
          <Grid
            container
            spacing={{ xs: 1, sm: 2, md: 3, lg: 5 }}
            maxWidth="1600px"
          >
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
              <ActiveUsersAnalytics />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
              <ActiveMerchantsAnalytics />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
              <RecentReportsGeneratedAnalytics />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
              <Stack spacing={{ xs: 1, sm: 1, md: 2 }}>
                <PendingMerchantsAnalytics />
                <UnvalidatedAccountAnalytics />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }}>
              <AverageRiskSeriesAnalytics />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
              <LoginActivityAnalytics />
            </Grid>
          </Grid>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: {
                    xs: "1.6em",
                    sm: "1.6em",
                    md: "2.1em",
                    lg: "2.1em",
                  },
                }}
              >
                Accounts
              </Typography>
              <Divider />
            </Stack>
            <Grid container spacing={{ xs: 1, sm: 2, md: 5 }} maxWidth="1600px">
              <Grid size={12}>
                <UserAccountAnalytics />
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default AdministratorDashboard;
