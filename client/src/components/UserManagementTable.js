import { Paper, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';


const UserManagementTable = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const response = await fetch('http://localhost:8000/users')
        .then(response => {
          if (!response.ok) {
            throw new Error(response.status)
          }
        })
        .then(data => setData(data))
        .catch(err => {
          console.log(err)
        })
    }
    getUsers()
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, sortable: false },
    { field: 'fullName', headerName: 'Full Name', width: 200, sortable: true },
    { field: 'email', headerName: 'Email', width: 300, sortable: false },
    { field: 'createdAt', headerName: 'Created At', width: 120, sortable: true },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          {params.row.roles.map((role) => (
            <Chip key={role}
              label={role}
              size="small"
              color="error"/>
          ))}
        </Stack>
      ),
    },
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
