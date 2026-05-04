import {
  Card,
  CardContent,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Displays the amount of standard users that have logged into the system over the
 * past month and past week.
 */
const ActiveUsersAnalytics = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard/active-account-analytics`, {
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
    <Card sx={{ p: "5px" }}>
      <CardContent>
        <Stack direction="column" spacing={1}>
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
            Active Accounts
          </Typography>
          <Stack>
            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: "2.0em",
                  sm: "1.5em",
                  md: "3.0em",
                  lg: "3.0em",
                  xl: "3.6em",
                },
              }}
            >
              {data.pastMonth}
            </Typography>
            <Typography
              variant="subtle"
              sx={{
                fontSize: {
                  xs: "1.0em",
                  sm: "0.8em",
                  md: "1.0em",
                  lg: "1.0em",
                  xl: "1.2em",
                },
              }}
            >
              {data.pastWeek} in the past week
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ActiveUsersAnalytics;
