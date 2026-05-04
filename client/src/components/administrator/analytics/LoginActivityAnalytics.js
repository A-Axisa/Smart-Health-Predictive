import dayjs from "dayjs";
import {
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const TIMESPAN_IN_DAYS = 7;

/**
 * Displays the number of logins over the past seven days.
 */
const LoginActivityAnalytics = () => {
  const [xAxisData, setXAxisData] = useState([]);
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard/login-activity/${TIMESPAN_IN_DAYS}`, {
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
        setXAxisData(data.map((d) => new Date(d.date)));
        setLoginData(data.map((d) => d.total));
      });
  }, []);

  return (
    <Card sx={{ p: "5px" }}>
      <CardContent>
        <Grid container rowSpacing={1}>
          <Grid size={1} />
          <Grid alignContent="center" size={10}>
            <Typography
              variant="h6"
              textAlign="center"
              paddingTop="12px"
              paddingBottom="12px"
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
              Login Activity (7 Days)
            </Typography>
          </Grid>
          <Grid size={1}></Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Box paddingTop="27px">
              <BarChart
                sx={{
                  "& .MuiChartsAxis-tickLabel": { fontSize: "15px !important" },
                }}
                colors={["rgb(159, 57, 190)"]}
                xAxis={[
                  {
                    id: "date",
                    data: xAxisData,
                    scaleType: "band",
                    valueFormatter: (date) => dayjs(date).format("DD"),
                    label: "Day",
                    height: 60,
                    tickLabelStyle: {
                      angle: -20,
                      textAnchor: "end",
                    },
                  },
                ]}
                yAxis={[
                  {
                    label: "Logins",
                  },
                ]}
                series={[
                  {
                    data: loginData,
                  },
                ]}
                height={400}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LoginActivityAnalytics;
