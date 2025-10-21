import { useState, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ConfirmationDialog from '../confirmationDialog'


const AccountApprovalTable = ({}) => {
  const [userData, setUserData] = useState([]); // Stores user data
  const [selectedUser, setselectedUser] = useState(); // Stores the selected user
  const [dialogOpen, setDialogOpen] = useState(false); // Stores dialog state
  
  const fetchMerchants = () => {
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
  };

  const handleConfirmation = () => {
    fetch(`http://localhost:8000/users/merchants/${selectedUser}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.status);
      }
      return response.json();
    })
    .then(() => {
      setDialogOpen(false);
      setselectedUser(null);
      fetchMerchants();
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const columns = [
    { field: 'id', headerName: 'User ID', width: 100, sortable: true },
    { field: 'fullName', headerName: 'Full Name', width: 250, sortable: true },
    { field: 'email', headerName: 'Email', width: 250, sortable: false },
    { field: 'createdAt', headerName: 'Created At', width: 200, sortable: true },
    { 
      field: 'confirm',
      headerName: 'Confirm',
      width: 130, sortable: false,
      renderCell: (params) => {
        return (
          <Button
            variant='contained'
            onClick={() => {
              setselectedUser(params.row.id);
              setDialogOpen(true)
            }}
          >
            Confirm
          </Button>
        )
      }
    },
  ]

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <>
    <Paper sx={{ width: '950px'}}>
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