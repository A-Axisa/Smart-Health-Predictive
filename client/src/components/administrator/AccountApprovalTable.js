import { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ConfirmationDialog from '../confirmationDialog'


const AccountApprovalTable = ({}) => {
  const [userData, setUserData] = useState([]); // Stores user data
  const [selectedUser, setselectedUser] = useState(); // Stores the selected user
  const [dialogOpen, setDialogOpen] = useState(false); // Stores dialog state
  
  useEffect(() => {
    fetch(`http://localhost:8000/users/merchants/`)
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

  const handleConfirmation = () => {
    fetch(`http://localhost:8000/merchants/${selectedUser}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.status);
      }
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const columns = [
    { field: 'id', headerName: 'User ID', width: 250, sortable: true },
    { field: 'fullName', headerName: 'Full Name', width: 250, sortable: true },
    { field: 'email', headerName: 'Email', width: 250, sortable: false },
    { field: 'createdAt', headerName: 'Created At', width: 200, sortable: true },
    { 
      field: 'confirm',
      headerName: 'Confirm',
      width: 200, sortable: false,
      // renderCell: (params) => {
      //   return (
      //     params
      //   );
      // }
    },
  ]

  return (
    <>
    <Paper sx={{ width: '1140px'}}>
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
        title="Confirm Validation"
        message="Are you sure you want to validate this merchant account?"
        confirmText="Validate"
        cancelText="Cancel"
        confirmColor="success"
        cancelColor="error"
        confirm={handleConfirmation}
        cancel={() => setDialogOpen(false)}
      />
    </>
  );
}

export default AccountApprovalTable