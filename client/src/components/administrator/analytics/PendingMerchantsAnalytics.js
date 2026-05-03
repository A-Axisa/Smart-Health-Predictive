import { Card, CardContent, Container, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import ErrorIcon from "@mui/icons-material/Error";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * A page used to display registration information and provide a form to allow
 * users to register.
 */
const PendingMerchantsAnalytics = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard/pending-merchants-analytics`, {
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
    <Card sx={{ px: "5px", py: "0px", textAlign: "center" }}>
      <CardContent>
        <Stack direction="row">
          <Stack direction="row" justifyContent="space-around">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h4">{data.amount}</Typography>
              <Typography variant="h7">Merchants awaiting review</Typography>
            </Stack>
            {data.amount > 0 && (
              <ErrorIcon sx={{ fontSize: 40, color: "red" }} />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PendingMerchantsAnalytics;
