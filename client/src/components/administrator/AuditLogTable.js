import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EVENT_TYPES = [
  "LOGIN",
  "LOGOUT",
  "REGISTRATION",
  "EMAIL_VALIDATION",
  "PASSWORD_CHANGE",
  "ROLE_CHANGED",
  "ACCOUNT_DELETED",
  "MERCHANT_VALIDATED",
  "PREDICTION_REQUEST",
  "DATA_IMPORT",
  "FAILED_LOGIN_ATTEMPT"
];

const AuditLogTable = () => {

  const [logData, setLogData] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });

  // Filter states
  const [emailInput, setEmailInput] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [eventType, setEventType] = useState('');

  // Debounce email input
  useEffect(() => {
    const timer = setTimeout(() => {
      // resetting page to 0 when filter changes
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setUserEmail(emailInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [emailInput]);

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams({
      skip: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize
    });
    
    if (userEmail) params.append('user_email', userEmail);
    if (eventType) params.append('event_type', eventType);

    fetch(`${API_BASE}/logs?${params.toString()}`, { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
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
  }, [paginationModel.page, paginationModel.pageSize, userEmail, eventType]);

  const columns = [
    { field: "logID", headerName: "Log ID", width: 60 },
    { field: "eventType", headerName: "Event Type", width: 180 },
    { field: "success", headerName: "Success", width: 80, type: "boolean" },
    { field: "userEmail", headerName: "User Email", width: 220 },
    { field: "ipAddress", headerName: "IP Address", width: 130 },
    { field: "device", headerName: "Device", width: 160 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "description", headerName: "Description", width: 250 },
  ];

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          label="Search by Email"
          variant="outlined"
          size="small"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          sx={{ width: 300 }}
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
            <MenuItem value=""><em>All</em></MenuItem>
            {EVENT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <div style={{ width: '100%' }}>
        <DataGrid
          rows={logData}
          columns={columns}
          getRowHeight={() => 'auto'}
          getRowId={(row) => row.logID}
          rowCount={totalLogs}
          loading={loading}
          pageSizeOptions={[50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableColumnResize
          disableRowSelectionOnClick
          sx={{ 
            border: 0,
            p: 1,
            // Removes cell outline.
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-filler, & .MuiDataGrid-columnHeader': {
              backgroundColor: '#f1f1f1f1',
            },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: '1.4rem',
              alignItems: 'flex-start',
              py: 1
            },
          }}
        />
      </div>
    </Paper>
  );
}

export default AuditLogTable
