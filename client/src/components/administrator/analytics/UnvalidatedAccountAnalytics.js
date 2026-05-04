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
 * Displays the number of unvalidated user accounts in the system.
 */
const UnvalidatedAccountAnalytics = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard/unvalidated-account-analytics`, {
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
    <Card sx={{ px: "5px", py: "0px", textAlign: "center" }}>
      <CardContent>
        <Stack direction="row">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h4"
              sx={{
                fontSize: {
                  xs: "1.4em",
                  sm: "1.0em",
                  md: "1.6em",
                  lg: "1.6em",
                  xl: "2.1em",
                },
              }}
            >
              {data.amount}
            </Typography>
            <Typography
              variant="h7"
              sx={{
                fontSize: {
                  xs: "1.0em",
                  sm: "0.9em",
                  md: "1.0em",
                  lg: "1.0em",
                  xl: "1.0em",
                },
              }}
            >
              Unvalidated User Accounts
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UnvalidatedAccountAnalytics;
