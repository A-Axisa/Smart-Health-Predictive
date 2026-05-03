import { Card, CardContent, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const UserLanding = ({}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [data, setData] = useState({});

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
        minHeight: "100vh",
        bgcolor: "#fdf7ff",
        ml: "65px",
        mt: "66px",
        pt: 1,
        pl: 5,
        pr: 5,
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #d6d6d6",
          mb: 4,
          py: 3,
        }}
      >
        <Typography variant="h4">Health Overview</Typography>
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
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Card Percentages */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {["stroke", "diabetes", "cvd"].map((key) => (
              <Card key={key} sx={{ borderRadius: "10px", flex: 1 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#747474" }}
                  >
                    {key.toUpperCase()}
                  </Typography>
                  <Typography variant="h4">
                    {data?.risks?.[key]?.slice(-1)[0] ?? 0}%
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      px: 0.4,
                      py: 0.1,
                      mt: 2,
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
          <Card sx={{ p: 2 }}>
            <BarChart
              dataset={chartData}
              xAxis={[{ dataKey: "date" }]}
              series={[
                { dataKey: "stroke", label: "Stroke (%)" },
                { dataKey: "diabetes", label: "Diabetes (%)" },
                { dataKey: "cvd", label: "CVD (%)" },
              ]}
              colors={["#712b89", "#e091ff", "#3a0050"]}
              height={400}
            />
          </Card>
        </Box>

        {/* Recommendations */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              borderRadius: "10px",
              p: 2,
              height: "95%",
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
