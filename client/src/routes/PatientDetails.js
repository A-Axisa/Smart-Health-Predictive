import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * A page used to display a individual patient information for a merchant user.
 */
const PatientDetails = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const { patientID } = useParams();

  return (
    <Box
      sx={{
        ml: "250px",
        mt: "66px",
      }}
    >
      <h1>Patient Details</h1>
      <h2>Patient ID: {patientID}</h2>
    </Box>
  );
};

export default PatientDetails;
