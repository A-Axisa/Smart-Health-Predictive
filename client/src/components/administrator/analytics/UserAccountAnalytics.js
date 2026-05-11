import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Displays general account information in the system.
 */
const UserAccountAnalytics = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard/user-analytics`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <Card>
      <CardContent>
        <Grid container size={12} spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
            <Stack direction="column">
              <Typography
                variant="h6"
                sx={{
                  fontSize: {
                    xs: "1.0em",
                    sm: "0.9em",
                    md: "1.0em",
                    lg: "1.0em",
                    xl: "1.2em",
                  },
                }}
              >
                Total Accounts
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.4em",
                    sm: "1.4em",
                    md: "1.6em",
                    lg: "1.6em",
                    xl: "2.1em",
                  },
                }}
              >
                {data.totalAccounts}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
            <Stack direction="column">
              <Typography
                variant="h6"
                sx={{
                  fontSize: {
                    xs: "1.0em",
                    sm: "0.9em",
                    md: "1.0em",
                    lg: "1.0em",
                    xl: "1.2em",
                  },
                }}
              >
                Total Standard Users
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.4em",
                    sm: "1.4em",
                    md: "1.6em",
                    lg: "1.6em",
                    xl: "2.1em",
                  },
                }}
              >
                {data.totalStandard}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
            <Stack direction="column">
              <Typography
                variant="h6"
                sx={{
                  fontSize: {
                    xs: "1.0em",
                    sm: "0.9em",
                    md: "1.0em",
                    lg: "1.0em",
                    xl: "1.2em",
                  },
                }}
              >
                Total Partners
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.4em",
                    sm: "1.4em",
                    md: "1.6em",
                    lg: "1.6em",
                    xl: "2.1em",
                  },
                }}
              >
                {data.totalMerchants}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
            <Stack direction="column">
              <Typography
                variant="h6"
                sx={{
                  fontSize: {
                    xs: "1.0em",
                    sm: "0.9em",
                    md: "1.0em",
                    lg: "1.0em",
                    xl: "1.2em",
                  },
                }}
              >
                Total Patients
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.4em",
                    sm: "1.4em",
                    md: "1.6em",
                    lg: "1.6em",
                    xl: "2.1em",
                  },
                }}
              >
                {data.totalPatients}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserAccountAnalytics;
