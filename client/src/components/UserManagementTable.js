import { Paper, Box, MenuItem, Select, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfirmationDialog from '../components/confirmationDialog'


const UserManagementTable = () => {

  const [userData, setUserData] = useState([]); // Stores user data
  const [selectedRow, setSelectedRow] = useState(null); // Stores the current row being edited
  const [selectedRole, setSelectedRole] = useState(null); // Stores the current role
  const [newRole, setNewRole] = useState(null); // Temp store for the pending role
  const [dialogOpen, setDialogOpen] = useState(false); // Determines dialog visibility
  const [roleData, setRoleData] = useState([]); // Stores role data

  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => setUserData(data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/roles')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => setRoleData(data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Update user object with new role in state
  const confirmRoleChange = () => {
   if (selectedRow && newRole) {
      setUserData((prev) =>
        prev.map((user) =>
          user.id === selectedRow ? { ...user, role: newRole } : user
        )
      );
    }
    setDialogOpen(false);
    setNewRole(null);
    setSelectedRow(null);
  }

  // Cancels role change and resets state
  const cancelRoleChange = () => {
    setDialogOpen(false);
    setSelectedRow(null);
    setSelectedRole(null);
    setNewRole(null);
  }

  // Updates states when new role is selected
  const handleRoleSelect = (row, oldRole, newRole) => {
    setSelectedRow(row);
    setSelectedRole(oldRole);
    setNewRole(newRole);
    setDialogOpen(true);
  }

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
        return (
        <Box sx={{overflow: 'visible', width: '100%', display: 'flex', marginTop: 0.6}}>
          <Select
            key={params.row.role}
            value={selectedRow === params.row.id && newRole ? newRole : params.row.role}
            size="small"
            sx={{ width: '100%', alignItems: 'center', display: 'flex'}}
            disabled={selectedRow !== params.row.id}
            onChange={(e) => {
              handleRoleSelect(params.row.id, params.row.role, e.target.value);
            }}
          >
            {roleData.map((role) =>
              <MenuItem key={role.id} value={role.id}>
                {role.roleName}
              </MenuItem>
            )}
          </Select>
          <IconButton
            size="small"
            color="info"
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
    <>
    <Paper sx={{ width: '1040px'}}>
      <DataGrid
        rows={userData}
        columns={columns}
        pageSizeOptions={[50, 100, 1000]}
        initialState={{ pagination: { pageSize: 50 } }}
        disableColumnResize
        disableRowSelectionOnClick
        sx={{ border: 0, p: 1 }}
      />
    </Paper>

    <ConfirmationDialog
      open={dialogOpen}
      role={newRole}
      user={userData.find((user) => user.id === selectedRow)?.fullName}
      confirm={confirmRoleChange}
      cancel={cancelRoleChange}
    />
    </>
  )
};

export default UserManagementTable;
