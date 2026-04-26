import ReportTemplate from "../components/ReportTemplate";
import DownloadReportButton from "../components/DownloadReportButton";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import ConfirmationDialog from "../components/confirmationDialog";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  TextField,
} from "@mui/material";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const MerchantReports = ({}) => {
  const location = useLocation();
  const pageData = location.state;
  const defaultSelectedPatientId =
    pageData && pageData["patientName"] ? pageData["patientName"] : null;

  const [reportDates, setReportDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [reportData, setReportData] = useState();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patients, setPatients] = useState([]); // Stores list of patients
  const [selectedPatient, setSelectedPatient] = useState(""); // Stores the selected patient
  const [reports, setReports] = useState([]); // Stores all report data

  function fetchMerchantReports() {
    fetch(`${API_BASE}/merchants/reports`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setReports(data);
          // Creates an array of distinct patient names
          let distinctPatientNames = [...new Set(data.map((r) => r.name))];
          setPatients(distinctPatientNames);
          setSelectedPatient(defaultSelectedPatientId);
          setSelectedDate(null);

          if (defaultSelectedPatientId) {
            const selectedReports = data.filter(
              (r) => r.name === defaultSelectedPatientId,
            );
            setReportDates(selectedReports);
            setSelectedDate(selectedReports[0]); // Select first report
          }
        }
      })
      .catch((err) => {
        console.log(err);
      }, []);
  }

  // Fetch the merchant reports
  useEffect(() => {
    fetchMerchantReports();
  }, []);

  // Fetch report data
  useEffect(() => {
    if (!selectedDate) return;
    fetch(`${API_BASE}/report-data/${selectedDate.healthDataId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch((err) => console.log(err));
  }, [selectedDate]);

  // Delete report data
  async function deleteReport() {
    if (!selectedDate) return;
    try {
      fetch(`${API_BASE}/report-data/${selectedDate.healthDataId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Filter remaining reports and update state
      let updatedReports = reports.filter(
        (r) => r.healthDataId !== selectedDate.healthDataId,
      );
      setReports(updatedReports);
      // Re-select the patient reports and update state
      let patientReports = updatedReports.filter(
        (r) => r.name === selectedPatient,
      );
      setReportDates(patientReports);
      setSelectedDate(patientReports[0]);
    } catch (err) {
      console.log(err);
    }
    // Close Dialog
    setDeleteDialogOpen(false);
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        ml: "250px",
        mt: "66px",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Report History
          </Typography>
        </Box>
        {/* Patient List */}
        <Box sx={{ p: 2 }}>
          <Autocomplete
            fullWidth
            options={patients}
            value={selectedPatient}
            onChange={(event, newValue) => {
              // Filter reports by selected user
              const selectedReports = reports.filter((r) => r.name === newValue);
              setSelectedPatient(newValue);
              setReportDates(selectedReports);
              setSelectedDate(selectedReports[0]); // Select first report
            }}
            getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient"
                />
              )}
          />
        </Box>
        <List component="nav" sx={{ p: 0 }}>
          {reportDates.map((item) => (
            <ListItem
              key={item.healthDataId}
              selected={selectedDate?.healthDataId === item.healthDataId}
              onClick={(e) => setSelectedDate(item)}
              button
              sx={{
                py: 2,
                px: 3,
                borderLeft:
                  selectedDate?.healthDataId === item.healthDataId
                    ? "4px solid"
                    : "4px solid transparent",
                borderLeftColor: "primary.main",
                bgcolor:
                  selectedDate?.healthDataId === item.healthDataId
                    ? "action.selected"
                    : "transparent",
              }}
            >
              <ListItemText
                primary={`Report: ${new Date(item.date).toLocaleDateString("en-AU")}`}
                slotProps={{
                  primary: {
                    style: {
                      fontWeight:
                        selectedDate?.healthDataId === item.healthDataId
                          ? 600
                          : 400,
                    },
                  },
                }}
              />
              {/* Delete Report Button */}
              {selectedDate?.healthDataId === item.healthDataId && (
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={(e) => setDeleteDialogOpen(true)}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      {/* Report Content */}
      <Box sx={{ flex: 1 }}>
        {/* Render if there are reports for the selected patient */}
        {selectedDate && reportData ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
              <DownloadReportButton
                healthDataId={selectedDate?.healthDataId}
                flatReportData={reportData}
                meta={{
                  date: selectedDate?.date,
                  healthDataId: selectedDate?.healthDataId,
                }}
              />
            </Box>
            <ReportTemplate report={reportData} date={selectedDate.date} />
          </>
        ) : (
          <Typography sx={{ p: 3 }}>No patient selected.</Typography>
        )}
      </Box>
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Report"
        message={
          <>
            This action will permanently delete the selected health report and
            all related health data. Are you sure you want to delete this health
            report?.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        cancelColor="primary"
        confirm={() => deleteReport()}
        cancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default MerchantReports;
