import { Box, Typography, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const MerchantLanding = () => {
  const [data, setData] = useState({});
  const [name, setName] = useState("");

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
    fetch(`${API_BASE}/merchant-dashboard`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const stats = [
    {
      label: "Total Patients",
      value: data.totalPatients ?? 0,
      text: "under your care",
    },
    { label: "Total Reports", value: data.totalReports ?? 0, text: "all time" },
    {
      label: "Reports (30 days)",
      value: data.reportsLast30Days ?? 0,
      text: "total submissions",
    },
    {
      label: "Inactive Patients",
      value: data.inactivePatients ?? 0,
      text: "no submissions in 30 days",
    },
  ];

  function relativeTime(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7fffd",
        ml: "65px",
        mt: "66px",
        pt: 1,
        pl: 5,
        pr: 5,
      }}
    >
      <Box sx={{ borderBottom: "1px solid #d6d6d6", mb: 4, py: 3 }}>
        <Typography variant="h4">Patient Overview</Typography>
        <Typography variant="body1">{name}'s patient activity</Typography>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {stats.map(({ label, value, text }) => (
          <Card key={label} sx={{ borderRadius: "10px", flex: 1 }}>
            <CardContent>
              <Typography variant="h7" gutterBottom sx={{ color: "#747474" }}>
                {label.toUpperCase()}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {value}
              </Typography>
              <Typography variant="h8" sx={{ color: "#747474" }}>
                {text}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Condition risk graph */}
        <Card sx={{ flex: 1, borderRadius: "10px", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Risk distribution
          </Typography>
          {["stroke", "cvd", "diabetes"].map((condition) => {
            const dist = data.riskDistribution?.[condition] ?? {};
            const high = dist.high ?? 0;
            const mod = dist.moderate ?? 0;
            const low = dist.low ?? 0;
            const maxVal = Math.max(high, mod, low);
            return (
              <Box key={condition} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Typography sx={{ color: "#747474" }}>
                    {condition.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#747474" }}>
                    PATIENTS
                  </Typography>
                </Box>
                {[
                  ["Low", "#3aa82c", low],
                  ["Moderate", "#ffa113", mod],
                  ["High", "#da2828", high],
                ].map(([label, color, val]) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    <Typography sx={{ color: "#747474", width: 60 }}>
                      {label}
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        height: 8,
                        bgcolor: "#f0f0f0",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${Math.round((val / maxVal) * 100)}%`,
                          bgcolor: color,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{ color: "#747474", width: 20, textAlign: "right" }}
                    >
                      {val}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          })}
        </Card>

        {/* Report activity */}
        <Card sx={{ flex: 1, borderRadius: "10px", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Report activity
          </Typography>
          <Box sx={{ maxHeight: 380, overflowY: "auto" }}>
            {(data.reportActivity ?? []).length === 0 ? (
              <Typography sx={{ color: "#747474" }}>
                No recent report activity.
              </Typography>
            ) : (
              data.reportActivity.map((a) => (
                <Box
                  key={a}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 1,
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography sx={{ flex: 1, pt: 1 }}>{a.message}</Typography>
                  <Typography sx={{ color: "#747474", whiteSpace: "nowrap" }}>
                    {relativeTime(a.createdAt)}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default MerchantLanding;
