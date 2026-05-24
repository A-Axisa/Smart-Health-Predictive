import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState, useCallback } from "react";
import ConfirmationDialog from "../../components/dialog/confirmationDialog";
import DownloadReportButton from "../../components/healthReport/DownloadReportButton";
import ReportTemplate from "../../components/healthReport/ReportTemplate";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * A page that provide the tools for a user to past health reports.
 *
 * @returns {@mui.material.Container}
 */
const AIHealthPrediction = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reportDates, setReportDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [reportData, setReportData] = useState();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const fetchReportDates = useCallback(() => {
    fetch(`${API_BASE}/get-health-data-dates`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setReportDates(data);

        if (data.length > 0) {
          setSelectedDate(data[0]);
          console.log("The selected date is:", data[0]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchReportDates();
  }, [fetchReportDates]);

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
      })
        .then((res) => res.json())
        .then((data) => setReportData(data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
    // Reload reports
    fetchReportDates();
    // Close Dialog
    setDeleteDialogOpen(false);
  }

  // Extract and sort month and years for drop down.
  const years = [
    ...new Set(reportDates.map((r) => new Date(r.date).getFullYear())),
  ].sort((a, b) => a - b);

  const months = [
    ...new Set(
      reportDates
        .filter(
          (r) =>
            !selectedYear || new Date(r.date).getFullYear() === selectedYear,
        )
        .map((r) => new Date(r.date).getMonth() + 1),
    ),
  ].sort((a, b) => a - b);

  // Filters reports based on selected year and month if any.
  const filteredReportDates = reportDates.filter((r) => {
    const date = new Date(r.date);
    return (
      (!selectedYear || date.getFullYear() === selectedYear) &&
      (!selectedMonth || date.getMonth() + 1 === selectedMonth)
    );
  });

  const handleClear = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  // Prevents page from loading if the user has no health record
  if (!reportData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          ml: "65px",
          mt: "80px",
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" sx={{ color: "text.secondary" }}>
            No Health Prediction Reports Available
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/generate-report"
            sx={{
              width: isMobile ? "100%" : "auto",
              py: { xs: "0.8rem", sm: "0.6rem" },
              fontSize: { xs: "1rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          ml: "65px",
          mt: "80px",
        }}
      >
        <Paper variant="report-section">
          <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{ textAlign: "center" }}
            >
              Report History
            </Typography>
          </Box>

          {/* Date Select */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 2,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            {/* Year */}
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedMonth(null);
                }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Month */}
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString("en-AU", {
                      month: "long",
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button onClick={handleClear}>Clear</Button>
          </Box>
          <Box
            sx={{
              maxHeight: 190,
              overflowY: "auto",
            }}
          >
            <List component="nav" sx={{ p: 0 }}>
              {filteredReportDates.map((item) => (
                <ListItem
                  key={item.id}
                  selected={selectedDate.healthDataId === item.healthDataId}
                  onClick={(e) => setSelectedDate(item)}
                  button
                  sx={{
                    py: 2,
                    px: 3,
                    borderLeft:
                      selectedDate.healthDataId === item.healthDataId
                        ? "4px solid"
                        : "4px solid transparent",
                    borderLeftColor: "primary.main",
                    bgcolor:
                      selectedDate.healthDataId === item.healthDataId
                        ? "action.selected"
                        : "transparent",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h7"
                        sx={{
                          fontWeight:
                            selectedDate.healthDataId === item.healthDataId
                              ? 400
                              : 0,
                        }}
                      >
                        {`Report: ${new Date(item.date).toLocaleDateString("en-AU")}`}
                        <Typography variant="subtle">
                          {" "}
                          {`${new Date(item.date).toLocaleTimeString("en-AU")}`}
                        </Typography>
                      </Typography>
                    }
                  />

                  {/* Delete Report Button */}
                  {selectedDate.healthDataId === item.healthDataId && (
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
        </Paper>

        {/* Menu and Download Buttons */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              p: 2,
            }}
          >
            <Box sx={{ flexGrow: 1 }} />
            <DownloadReportButton
              healthDataId={selectedDate?.healthDataId}
              flatReportData={reportData}
              meta={{
                date: selectedDate?.date,
                healthDataId: selectedDate?.healthDataId,
              }}
            />
          </Box>

          {/* Report Content */}
          <ReportTemplate report={reportData} date={selectedDate.date} />
        </Box>
        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Report"
          message={
            <>
              This action will permanently delete the selected health report and
              all related health data. Are you sure you want to delete this
              health report?.
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
  }
};

export default AIHealthPrediction;
