import { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AuditLogSearchBar from "./AuditLogSearchBar";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const EVENT_TYPES = [
  "LOGIN",
  "LOGOUT",
  "REGISTRATION",
  "EMAIL_VALIDATION",
  "PASSWORD_CHANGE",
  "RESET_PASSWORD_REQUEST",
  "PASSWORD_RESET",
  "ROLE_CHANGED",
  "ACCOUNT_DELETED",
  "MERCHANT_VALIDATED",
  "PREDICTION_REQUEST",
  "DATA_IMPORT",
  "FAILED_LOGIN_ATTEMPT",
  "USER_PROFILE_UPDATED",
  "PATIENT_PROFILE_UPDATED",
];

const AuditLogTable = () => {
  const [logData, setLogData] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);

  // Filter states
  const [userEmail, setUserEmail] = useState("");
  const [eventType, setEventType] = useState("");

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams({
      skip: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize,
    });

    if (userEmail) params.append("user_email", userEmail);
    if (eventType) params.append("event_type", eventType);
    if (sortModel.length > 0) {
      params.append("sort_by", sortModel[0].field);
      params.append("sort_order", sortModel[0].sort || "desc");
    }

    fetch(`${API_BASE}/logs?${params.toString()}`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setLogData(data.logs || []);
        setTotalLogs(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [paginationModel.page, paginationModel.pageSize, userEmail, eventType, sortModel]);

  const handleEmailSearchChange = useCallback((value) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setUserEmail(value);
  }, []);

  const handleSortModelChange = useCallback((newSortModel) => {
    setSortModel(newSortModel);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const columns = [
    { field: "logID", headerName: "Log ID", width: 70, sortable: true },
    { field: "eventType", headerName: "Event Type", flex: 1, minWidth: 140, sortable: true },
    { field: "success", headerName: "Success", width: 80, type: "boolean", sortable: true },
    { field: "userEmail", headerName: "User Email", flex: 1.5, minWidth: 180, sortable: true },
    { field: "ipAddress", headerName: "IP Address", flex: 0.8, minWidth: 100, sortable: true },
    { field: "device", headerName: "Device", flex: 1, minWidth: 120, sortable: false },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 160, sortable: true },
    { field: "description", headerName: "Description", flex: 2, minWidth: 200, sortable: false },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <AuditLogSearchBar
            onSearchChange={handleEmailSearchChange}
            delay={500}
          />
          <FormControl size="small" sx={{ width: 250 }}>
            <InputLabel id="event-type-label">Filter by Event Type</InputLabel>
            <Select
              labelId="event-type-label"
              value={eventType}
              label="Filter by Event Type"
              onChange={(e) => {
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
                setEventType(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {EVENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={logData}
          columns={columns}
          getRowHeight={() => "auto"}
          getRowId={(row) => row.logID}
          rowCount={totalLogs}
          loading={loading}
          pageSizeOptions={[50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          disableColumnResize
          disableRowSelectionOnClick
          sx={{
            border: 0,
            p: 1,
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
              {
                outline: "none",
              },
            "& .MuiDataGrid-filler, & .MuiDataGrid-columnHeader": {
              backgroundColor: "#f1f1f1f1",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              lineHeight: "1.4rem",
              alignItems: "flex-start",
              py: 1,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default AuditLogTable;
