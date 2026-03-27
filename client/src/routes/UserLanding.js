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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fdf7ff",
        ml: "250px",
        mt: "66px",
      }}
    >
      <Typography>
        Health Overview
      </Typography>
    </Box>
  );
};
export default UserLanding;
