import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';


const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AuditLogTable = ({}) => {

  const [logData, setLogData] = useState([]);

  const fetchLogs = () => {
    fetch(`${API_BASE}/logs`)
    .then((response) => {
    if (!response.ok) {
        throw new Error(response.status);
    }
    return response.json();
    })
    .then(data => setLogData(data))
    .catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    { field: "logID", headerName: "Log ID" },
    { field: "eventType", headerName: "Event Type" },
    { field: "success", headerName: "Success" },
    { field: "userID", headerName: "User ID" },
    { field: "userEmail", headerName: "User Email" },
    { field: "ipAddress", headerName: "IP Address" },
    { field: "device", headerName: "Device" },
    { field: "description", headerName: "Description", },
    { field: 'createdAt', headerName: 'Created At' },
  ];

  return (
    <Paper sx={{ width: '100%'}}>
      <DataGrid
        rows={logData}
        columns={columns}
        getRowId={(row) => row.logID}
        pageSizeOptions={[50, 100, 1000]}
        initialState={{ pagination: { pageSize: 50 } }}
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
        }}
      />
    </Paper>
  );
}

export default AuditLogTable
