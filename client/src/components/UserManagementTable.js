import { Paper, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


// Temp user data (Repleace with API call later)
const rows = [
  { id: 1, fullName: "John Doe", email: "JohnDoe@gmail.com", createdAt: "01/10/2025", roles: ["admin", "user"] },
  { id: 2, fullName: "Mary Jane", email: "MaryJane@gmail.com", createdAt: "02/10/2025", roles: ["user"] }
];

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

const UserManagementTable = () => (
  <Paper sx={{ width: '100%'}}>
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={[50, 100, 1000]}
      initialState={{ pagination: { pageSize: 50 } }}
      sx={{ border: 0, p: 1}}
    />
  </Paper>
);

export default UserManagementTable;
