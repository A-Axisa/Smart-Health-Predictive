import { Paper, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';


const UserManagementTable = () => {

  const [data, setData] = useState([]);

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
    { field: 'fullName', headerName: 'Full Name', width: 200, sortable: true },
    { field: 'email', headerName: 'Email', width: 300, sortable: false },
    { field: 'createdAt', headerName: 'Created At', width: 120, sortable: true },
    { field: 'role', headerName: 'Roles', width: 200, sortable: false},
  ];

  return (
    <Paper sx={{ width: '100%'}}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[50, 100, 1000]}
        initialState={{ pagination: { pageSize: 50 } }}
        sx={{ border: 0, p: 1}}
      />
    </Paper>
  )
};

export default UserManagementTable;
