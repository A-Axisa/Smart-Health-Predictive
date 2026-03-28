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
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

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
        const email = user.email
        const givenName = email.split("@")[0].split(".")[0];
        setName(givenName);
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

return (
  <Box
    sx={{
      minHeight: "100vh",
      bgcolor: "#fdf7ff",
      ml: "250px",
      mt: "66px",
      pt: 1,
      pl: 5,
    }}
  >
    <Box
      sx={{
        borderBottom: "1px solid #d6d6d6",
        mb: 4,
        py: 3,
      }}
    >
      {/* Overview */}
      <Typography variant="h4">
        Health Overview
      </Typography>
      <Typography variant="h6">
        Welcome back, {name}!
      </Typography>
      <Typography variant="h6">
        It has been {" "}
        <Typography component="span" variant="h5" sx={{ color: "#712b89", fontWeight: "bold" }}>
          {data.days ?? 0} days
        </Typography>
        {" "} since your last report
      </Typography>
    </Box>

    {/* Percentages */}
    <Grid container spacing={2}>
      {["stroke", "diabetes", "cvd"].map((key) => (
        <Grid item xs={12} md={4} key={key}>
          <Card
            sx={{
              width: "230px",
              borderRadius: "10px",
            }}
          >
            <CardContent
              sx={{
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{color: "#747474"}}>
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
                  borderRadius: "5px",
                  backgroundColor:
                    (data?.diff?.[key] ?? 0) >= 0 ? "rgb(255, 221, 221)" : "#c6ffca",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color:
                      (data?.diff?.[key] ?? 0) >= 0 ? "#ff2424" : "#30ff61",
                  }}
                >
                  {data?.diff?.[key] >= 0 ? "+ " : "- "}
                  {(data?.diff?.[key] ?? 0).toFixed(2)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Recommendations */}
    <Card
      sx={{
        borderRadius: "10px",
        width: "50%", 
        mt: 4,
        p: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Latest Recommendations
      </Typography>
      <Box>
        {data?.recommendations &&
          Object.entries(data.recommendations).map(([key, value], index, arr) => (
            <Box
              key={key}
              sx={{
                pb: 2,
                mb: 2,
                borderBottom:
                  index !== arr.length - 1 ? "1px solid #e0e0e0" : "none",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {key.toUpperCase()}
              </Typography>

              <Typography sx={{ whiteSpace: "pre-line" }}>
                {value}
              </Typography>
            </Box>
          ))}
      </Box>
    </Card>
  </Box>
  );
};
export default UserLanding;
