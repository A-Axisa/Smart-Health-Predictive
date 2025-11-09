import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Grid,
  Typography,
  Stack,
  Button,
  CardActions,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const UserLanding = ({ }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/user/me`, {
      method: "GET",
      credentials: "include"
    })
      .then(response => response.json())
      .then(user => {
        setName(user.name);
      })
  }, []);

  async function logout(e) {
    e.preventDefault();

  await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    }).then(data => {
      navigate('/login')
    })
  }


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5"
      }}
    >
      <Paper
        variant="outlined"
        elevation={24}
        sx={{
          maxWidth: 1200,
          margin: "2rem auto",
          padding: 3,
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Welcome Header */}
        <Typography variant="h3" fontWeight={600} color="primary" align="center" gutterBottom>
          Welcome{name ? ", " + name.split(' ')[0] : ""}
        </Typography>

        {/* Main Content */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            Welcome to Smart Health Predictive. Our AI Prediction Model has been designed to provide a 
            personal a personalised risk analysis regarding three notable diseases: stroke, cardiovascular disease (CVD), and diabetes,
            providing insight into your health.
          </Typography>
        </Box>

        {/*Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 'auto' }}>
          <Stack spacing={2} direction="column" alignItems="flex-end">
            <Button fullWidth variant="outlined" onClick={logout}>Logout</Button>
            <Button fullWidth onClick={() => navigate("/generate-report")} variant="contained" size="large">
              Generate Report
            </Button>
            <Button fullWidth onClick={() => navigate("/ai-health-prediction")} variant="contained" size="large">
              Health Prediction History
            </Button>
            <Button fullWidth onClick={() => navigate("/health-analytics")} variant="contained">
              Health Analytics
            </Button>
            <Button fullWidth onClick={() => navigate("/user-settings")} variant="contained">
              User Settings
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>


  );
}
export default UserLanding
