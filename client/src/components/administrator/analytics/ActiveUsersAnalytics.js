import { Card, CardContent, Container, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * A page used to display registration information and provide a form to allow
 * users to register.
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
        console.log(data);
        setData(data);
      });
  }, []);

  return (
    <Card sx={{ p: "5px" }}>
      <CardContent>
        <Stack direction="column" spacing={1}>
          <Typography variant="h6">Active Accounts</Typography>
          <Stack>
            <Typography variant="h2">{data.pastMonth}</Typography>
            <Typography variant="subtle">
              {data.pastWeek} in the past week
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ActiveUsersAnalytics;
