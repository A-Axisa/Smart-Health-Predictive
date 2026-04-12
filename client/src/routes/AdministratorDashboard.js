import { Box, Typography, Card, CardContent } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";


const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const AdministratorDashboard = () => {

  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard`, {
      method: "GET",
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setData);
  }, []);

  // Fills in missing dates with count = 0
  function fillEmptyDates(activity = [], days = 30) {
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      // Create a date for each day in the range
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Format date to match backend data
      const key = date.toISOString().slice(0, 10);
      const match = activity.find(r => r.date === key);

      result.push({
        date: key.slice(5),
        count: match ? match.count : 0
      });
    }
    return result;
  }

  const userStats = [
    { label: "Total Users", value: data.totalUsers ?? 0, text: "validated accounts" },
    { label: "Total Patients", value: data.totalPatients ?? 0, text: "users" },
    { label: "Total Partners", value: data.totalMerchants ?? 0, text: "partner accounts" },
    { label: "New Users last 30 days", value: data.newUsersLast30days ?? 0, text: "recently registered" },
  ];

  const activityStats = [
    { label: "Validated Users", value: data.validatedUsers ?? 0, text: "verified accounts" },
    { label: "Unvalidated Users", value: data.invalidatedUsers ?? 0, text: "pending verification" },
    { label: "Active Patients", value: data.activePatients ?? 0, text: "submitted in last 30 days" },
    { label: "Inactive Patients", value: data.inactivePatients ?? 0, text: "no recent submission" },
    { label: "Failed Logins last 24 hours", value: data.failedLoginAttemptsLastDay ?? 0, text: "failed attempts" },
  ]

  const reportStats = [
    { label: "Total Reports", value: data.totalReports ?? 0, text: "all time" },
    { label: "Latest Reports", value: data.reportsLastDay ?? 0, text: "last 24 hours" },
    { label: "Latest Reports", value: data.reportsLast7Days ?? 0, text: "last 7 days" },
    { label: "Latest Reports", value: data.reportsLast30Days ?? 0, text: "last 30 days" },
  ];

  const riskStats = [
    { label: "Average Stroke Risk", value: data.averageRiskStroke ?? 0, text: "across all patients" },
    { label: "Average CVD Risk", value: data.averageRiskCVD ?? 0, text: "across all patients" },
    { label: "Average Diabetes Risk", value: data.averageRiskDiabetes ?? 0, text: "across all patients" },
  ]

  const reportChartData = fillEmptyDates(data.reportActivity);
  const loginChartData = fillEmptyDates(data.loginActivity);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7fffd", ml: "250px", mt: "66px", pt: 1, pl: 5, pr: 5 }}>
      <Box sx={{ borderBottom: "1px solid #d6d6d6", mb: 4, py: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
      </Box>

      {/* User stats */}
      <Typography sx={{ color: "#747474" }}>USERS</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 1 }}>
        {userStats.map(({ label, value, text }) => (
          <Card key={label} sx={{ borderRadius: "10px", flex: 1 }}>
            <CardContent>
              <Typography gutterBottom sx={{ color: "#747474", fontSize: 12 }}>{label.toUpperCase()}</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
              <Typography sx={{ color: "#747474", fontSize: 12 }}>{text}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Activity stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {activityStats.map(({ label, value, text }) => (
          <Card key={label} sx={{ borderRadius: "10px", flex: 1 }}>
            <CardContent>
              <Typography gutterBottom sx={{ color: "#747474", fontSize: 12 }}>{label.toUpperCase()}</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
              <Typography sx={{ color: "#747474", fontSize: 12 }}>{text}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Report stats */}
      <Typography sx={{ color: "#747474", letterSpacing: "0.05em" }}>REPORTS</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 1 }}>
        {reportStats.map(({ label, value, text }) => (
          <Card key={label} sx={{ borderRadius: "10px", flex: 1 }}>
            <CardContent>
              <Typography gutterBottom sx={{ color: "#747474", fontSize: 12 }}>{label.toUpperCase()}</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
              <Typography sx={{ color: "#747474", fontSize: 12 }}>{text}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Average risks */}
      <Typography sx={{ color: "#747474" }}>AVERAGE RISK</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 1 }}>
        {riskStats.map(({ label, value, text }) => (
          <Card key={label} sx={{ borderRadius: "10px", flex: 1 }}>
            <CardContent>
              <Typography gutterBottom sx={{ color: "#747474", fontSize: 12 }}>{label.toUpperCase()}</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>{value}%</Typography>
              <Typography sx={{ color: "#747474", fontSize: 12 }}>{text}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        {/* Report Chart */}
        <Card sx={{ flex: 1, borderRadius: "10px", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Report activity (last 30 days)</Typography>
          <BarChart
            dataset={reportChartData}
            xAxis={[{ dataKey: "date", scaleType: "band" }]}
            yAxis={[{ tickMinStep: 1 }]}
            series={[{ dataKey: "count", label: "Reports", color: "#712b89" }]}
            height={260}
            margin={{ top: 10, bottom: 30, left: 30, right: 10 }}
            legend={{ hidden: true }}
          />
        </Card>

        {/* Activity chart */}
        <Card sx={{ flex: 1, borderRadius: "10px", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Login activity (last 30 days)</Typography>
          <BarChart
            dataset={loginChartData}
            xAxis={[{ dataKey: "date", scaleType: "band" }]}
            yAxis={[{ tickMinStep: 1 }]}
            series={[{ dataKey: "count", label: "Logins", color: "#712b89" }]}
            height={260}
            margin={{ top: 10, bottom: 30, left: 30, right: 10 }}
            legend={{ hidden: true }}
          />
        </Card>
      </Box>

    </Box>
  );
};

export default AdministratorDashboard;
