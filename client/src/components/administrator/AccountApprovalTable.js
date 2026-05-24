import { Box, Button, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../dialog/confirmationDialog";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * A table that lists the merchant accounts awaiting approval by an administrator.
 *
 * @returns {@mui.material.Box}
 */
const AccountApprovalTable = ({}) => {
  const [userData, setUserData] = useState([]); // Stores user data
  const [selectedUser, setselectedUser] = useState(); // Stores the selected user
  const [dialogOpen, setDialogOpen] = useState(false); // Stores dialog state

  const fetchMerchants = () => {
    fetch(`${API_BASE}/users/merchants/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmation = () => {
    fetch(`${API_BASE}/users/merchants/${selectedUser}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      width: 250,
      sortable: true,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1.5,
      width: 250,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.2,
      width: 200,
      sortable: true,
    },
    {
      field: "confirm",
      headerName: "Confirm",
      flex: 0.8,
      width: 130,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            onClick={() => {
              setselectedUser(params.row.email);
              setDialogOpen(true);
            }}
          >
            Confirm
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <DataGrid
            rows={userData}
            columns={columns}
            getRowId={(row) => row.email}
          />
        </Box>
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
    </Box>
  );
};

export default AccountApprovalTable;
