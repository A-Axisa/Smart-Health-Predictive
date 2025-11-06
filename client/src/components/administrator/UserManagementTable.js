import { Paper, Box, MenuItem, Select, IconButton, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../confirmationDialog'


const UserManagementTable = () => {

  const [userData, setUserData] = useState([]); // Stores user data
  const [selectedRow, setSelectedRow] = useState(null); // Stores the current row being edited
  const [selectedRole, setSelectedRole] = useState(null); // Stores the current role
  const [newRole, setNewRole] = useState(null); // Temp store for the pending role
  const [dialogOpen, setDialogOpen] = useState(false); // Determines dialog visibility
  const [roleData, setRoleData] = useState([]); // Stores role data
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${API_BASE}/users`)
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
  }, [API_BASE]);

  useEffect(() => {
    fetch(`${API_BASE}/roles`)
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
  }, [API_BASE]);

  async function confirmRoleChange(e) {
    e.preventDefault();

    await fetch(`${API_BASE}/users/${selectedRow}/roles/${newRole}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((response) => {
      if(!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }).then(data => {
      setUserData((prev) =>
          prev.map((user) =>
            user.email === selectedRow ? { ...user, role: { id:newRole, name: data.role.name }} : user
          )
        );
      setDialogOpen(false);
      setNewRole(null);
      setSelectedRow(null);
    }).catch(err => {
      console.log(err)
    })
  };

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

  const handleDeleteUser = (userEmail) => {
    const user = userData.find(u => u.email === userEmail);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
  
    try {
      const response = await fetch(`${API_BASE}/users/${userToDelete.email}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to delete user: ${response.statusText}`);
      }
  
      const result = await response.json();
      
      // Generate a detailed message from the deletion report
      const report = result.deletion_report;
      let reportMessage = `User '${userToDelete.fullName}' deleted.`;
      if (report) {
        const details = Object.entries(report)
          .filter(([, value]) => value > 0)
          .map(([key, value]) => `${value} ${key.replace(/_/g, ' ')}`)
          .join(', ');
        if (details) {
          reportMessage += ` Cleaned up: ${details}.`;
        }
      }
  
      setSnackbar({ open: true, message: reportMessage, severity: 'success' });
      setUserData(prev => prev.filter(user => user.email !== userToDelete.email));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Delete user error:", error);
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  };

  const columns = [
    { field: 'email', headerName: 'Email', width: 250, sortable: true },
    { field: 'fullName', headerName: 'Full Name', width: 250, sortable: true },
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
            key={params.row.email}
            value={newRole && selectedRow === params.row.email ? newRole : params.row.role.id}
            size="small"
            sx={{ width: '100%', alignItems: 'center', display: 'flex'}}
            disabled={selectedRow !== params.row.email}
            onChange={(e) => {
              handleRoleSelect(params.row.email, params.row.role.id, e.target.value);
            }}
          >
            {roleData.map((role) =>
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            )}
          </Select>
          <IconButton
            size="small"
            color="info"
            onClick={() => setSelectedRow(params.row.email)}
            >
            <SettingsIcon />
          </IconButton>
        </Box>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDeleteUser(params.row.email)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
    <Paper sx={{ width: '1036px'}}>
      <DataGrid
        rows={userData}
        columns={columns}
        getRowId={(row) => row.email}
        pageSizeOptions={[50, 100, 1000]}
        initialState={{ pagination: { pageSize: 50 } }}
        disableColumnResize
        disableRowSelectionOnClick
        sx={{ border: 0, p: 1 }}
      />
    </Paper>

    <ConfirmationDialog
      open={dialogOpen}
      title={'Confirm Role Change'}
      message={
        <>
          Are you sure you want to change <b>{userData.find((user) => user.email === selectedRow)?.fullName}'s</b> role to
          <b> {roleData.find((role) => role.id === newRole)?.name}</b>?
        </>
      }
      confirmText={'Confirm'}
      cancelText={'Cancel'}
      confirmColor={'primary'}
      cancelColor={'error'}
      confirm={confirmRoleChange}
      cancel={cancelRoleChange}
    />
    <ConfirmationDialog
      open={deleteDialogOpen}
      title="Confirm Deletion"
      message={`Are you sure you want to delete the user ${userToDelete?.fullName}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
      cancelColor="primary"
      confirm={confirmDeleteUser}
      cancel={() => setDeleteDialogOpen(false)}
    />
    <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
        </Alert>
    </Snackbar>
    </>
  )
};

export default UserManagementTable;
