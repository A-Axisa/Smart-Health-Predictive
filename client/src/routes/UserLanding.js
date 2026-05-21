import {
  Card,
  CardContent,
  Box,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

// AppBar height: 56px toolbar + 2px border on mobile (xs), 64px + 2px on desktop (sm+)
const APPBAR_HEIGHT = { xs: "58px", sm: "66px" };
const DRAWER_WIDTH = "65px";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * A page that displays a collection of metrics based on the user's data.
 *
 * @returns {@mui.material.Box}
 */
const UserLanding = ({}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [data, setData] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetch(`${API_BASE}/user/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((user) => {
        setName(user.name);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/dashboard`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const chartData = (data?.risks?.dates ?? [])
    .map((date, i) => ({
      date,
      stroke: data?.risks?.stroke?.[i] ?? 0,
      diabetes: data?.risks?.diabetes?.[i] ?? 0,
      cvd: data?.risks?.cvd?.[i] ?? 0,
    }))
    .reverse();

  return (
    <Box
      sx={{
        ml: DRAWER_WIDTH,
        mt: APPBAR_HEIGHT,
        minHeight: {
          xs: `calc(100vh - 58px)`,
          sm: `calc(100vh - 66px)`,
        },
        pt: 1,
        pl: { xs: 2, sm: 5 },
        pr: { xs: 2, sm: 5 },
        pb: 4,
        boxSizing: "border-box",
      }}
    >
      {/* Health Overview header card */}
      <Box
        sx={{
          borderBottom: "1px solid #d6d6d6",
          mb: 4,
          py: 3,
        }}
      >
        <Card sx={{ p: 2 }}>
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
            Health Overview
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Welcome back, {name}!</Typography>
          <Typography variant="h6">
            It has been{" "}
            <Typography
              component="span"
              variant="h5"
              sx={{ color: "#712b89", fontWeight: "bold" }}
            >
              {data.days ?? 0} days
            </Typography>{" "}
            since your last report
          </Typography>
        </Card>
      </Box>

      {/* Main content: risk cards + chart + recommendations */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Left column: risk percentage cards + bar chart */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          {/* Risk percentage cards */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              flexDirection: "row",
            }}
          >
            {["stroke", "diabetes", "cvd"].map((key) => (
              <Card key={key} sx={{ flex: 1, minWidth: 0 }}>
                <CardContent
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    "&:last-child": { pb: { xs: 1.5, sm: 2 } },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    gutterBottom
                    sx={{
                      color: "#747474",
                      fontSize: { xs: "0.7rem", sm: "1.25rem" },
                      fontWeight: 500,
                    }}
                  >
                    {key.toUpperCase()}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.4rem", sm: "2.125rem" },
                      fontWeight: 400,
                      lineHeight: 1.2,
                    }}
                  >
                    {data?.risks?.[key]?.slice(-1)[0] ?? 0}%
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      px: 0.4,
                      py: 0.1,
                      mt: { xs: 0.5, sm: 2 },
                      whiteSpace: "nowrap",
                      borderRadius: "5px",
                      backgroundColor:
                        (data?.diff?.[key] ?? 0) >= 0
                          ? "rgb(255, 221, 221)"
                          : "#c6ffca",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "0.72rem", sm: "0.875rem" },
                        color:
                          (data?.diff?.[key] ?? 0) >= 0 ? "#ff2424" : "#17c940",
                      }}
                    >
                      {data?.diff?.[key] >= 0 ? "+ " : ""}
                      {(data?.diff?.[key] ?? 0).toFixed(2)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Bar chart */}
          <Card sx={{ p: 2, overflow: "hidden" }}>
            <BarChart
              dataset={chartData}
              xAxis={[{ dataKey: "date" }]}
              series={[
                { dataKey: "stroke", label: "Stroke (%)" },
                { dataKey: "diabetes", label: "Diabetes (%)" },
                { dataKey: "cvd", label: "CVD (%)" },
              ]}
              colors={["#712b89", "#e091ff", "#3a0050"]}
              height={isMobile ? 280 : 400}
            />
          </Card>
        </Box>

        {/* Right column: recommendations */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card
            sx={{
              p: 2,
              height: { xs: "auto", md: "95%" },
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Latest Recommendations
            </Typography>
            <Box>
              {data?.recommendations &&
                Object.entries(data.recommendations).map(
                  ([key, value], index, arr) => (
                    <Box
                      key={key}
                      sx={{
                        pb: 2,
                        mb: 2,
                        borderBottom:
                          index !== arr.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {key.toUpperCase()}
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-line" }}>
                        {value}
                      </Typography>
                    </Box>
                  ),
                )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default UserLanding;
