import { Paper, Box, MenuItem, Select, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';


const UserManagementTable = () => {

  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // Stores ID of the current row being edited

  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'User ID', width: 100, sortable: true},
    { field: 'fullName', headerName: 'Full Name', width: 250, sortable: true },
    { field: 'email', headerName: 'Email', width: 250, sortable: false },
    { field: 'createdAt', headerName: 'Created At', width: 200, sortable: true },
    {
      field: 'role',
      headerName: 'Role',
      width: 220,
      sortable: true,
      renderCell: (params) => {
        const activeRow = selectedRow === params.row.id;
        
        return (
        <Box sx={{overflow: 'visible', width: '100%', display: 'flex'}}>
          <Select
            value={params.row.role}
            size="small"
            sx={{ width: '100%', alignItems: 'center', display: 'flex'}}
            disabled={!activeRow}
          >
            {/* Temp values */}
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="merchant">Merchant</MenuItem>
          </Select>
          <IconButton
            size="small"
            color="info"
            sx={{overflow: 'visible'}}
            onClick={() => setSelectedRow(params.row.id)}
            >
            <SettingsIcon />
          </IconButton>
        </Box>
        )
      },
    },
  ];

  return (
    <Paper sx={{ width: '1040px'}}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[50, 100, 1000]}
        initialState={{ pagination: { pageSize: 50 } }}
        disableColumnResize
        disableRowSelectionOnClick
        sx={{ border: 0, p: 1 }}
      />
    </Paper>
  )
};

export default UserManagementTable;
