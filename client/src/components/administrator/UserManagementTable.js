import { Paper, Box, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import ConfirmationDialog from "../confirmationDialog";
import UserSearchBar from "./UserSearchBar";
import ToolBar from "./ToolBar";
import * as React from "react";

const UserManagementTable = () => {
  const [userData, setUserData] = useState([]); // Stores user data
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  const [newRole, setNewRole] = useState(null); // Temp store for the pending role
  const [dialogOpen, setDialogOpen] = useState(false); // Determines dialog visibility
  const [roleData, setRoleData] = useState([]); // Stores role data
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: "include",
    ids: new Set(),
  });

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({
      skip: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize,
    });
    if (debouncedSearchQuery) {
      params.append("search", debouncedSearchQuery);
    }

    fetch(`${API_BASE}/users?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data.users || data || []);
        setTotalUsers(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [
    API_BASE,
    paginationModel.page,
    paginationModel.pageSize,
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [API_BASE]);

  useEffect(() => {
    fetch(`${API_BASE}/roles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => setRoleData(data))
      .catch((err) => {
        console.log(err);
      });
  }, [API_BASE]);

  const confirmRoleChange = async (e) => {
    e.preventDefault();
    const emails = getSelectedEmails();

    try {
      await Promise.all(
        emails.map(async (email) => {
          const response = await fetch(
            `${API_BASE}/users/${email}/roles/${newRole}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
            },
          );
          if (!response.ok) throw new Error(response.status);
          return response.json();
        }),
      );

      const roleName = roleData.find((r) => r.id === newRole)?.name;
      setUserData((prev) =>
        prev.map((user) =>
          emails.includes(user.email)
            ? { ...user, role: { id: newRole, name: roleName } }
            : user,
        ),
      );

      setSnackbar({
        open: true,
        message: `Role updated to "${roleName}" for ${emails.length} user(s).`,
        severity: "success",
      });
      setDialogOpen(false);
      setNewRole(null);
      setRowSelectionModel({ type: "include", ids: new Set() });
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const emails = Array.isArray(userToDelete)
      ? userToDelete
      : [userToDelete?.email];
    if (!emails.length) return;

    try {
      await Promise.all(
        emails.map(async (email) => {
          const response = await fetch(`${API_BASE}/users/${email}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!response.ok) throw new Error(response.status);
          return response.json();
        }),
      );

      // NOTE: Need to collect deletion reports for each user.

      // Generate a detailed message from the deletion report
      // const result = await response.json();
      // const report = result.deletion_report;
      // let reportMessage = `User '${userToDelete.fullName}' deleted.`;

      // if (report) {
      //   const details = Object.entries(report)
      //     .filter(([, value]) => value > 0)
      //     .map(([key, value]) => `${value} ${key.replace(/_/g, ' ')}`)
      //     .join(', ');
      //   if (details) {
      //     reportMessage += ` Cleaned up: ${details}.`;
      //   }
      // }

      setSnackbar({
        open: true,
        message: `${emails.length} user(s) deleted.`,
        severity: "success",
      });
      setUserData((prev) =>
        prev.filter((user) => !emails.includes(user.email)),
      );
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setRowSelectionModel({ type: "include", ids: new Set() }); // Reset the checkbox after deletion.
    } catch (error) {
      console.error("Delete user error:", error);
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  // Returns array of emails from the selection model.
  const getSelectedEmails = (model = rowSelectionModel) => {
    if (model?.ids instanceof Set) return [...model.ids];
    if (Array.isArray(model)) return model;
    return [];
  };

  const handleUsersDelete = () => {
    setUserToDelete(getSelectedEmails());
    setDeleteDialogOpen(true);
  };

  const handleUsersRoleChange = (roleId) => {
    setNewRole(roleId);
    setDialogOpen(true);
  };

  const handleSearchChange = useCallback((value) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setDebouncedSearchQuery(value);
  }, []);

  const columns = [
    { field: "email", headerName: "Email", width: 250, sortable: true },
    { field: "fullName", headerName: "Full Name", width: 250, sortable: true },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      sortable: true,
    },
    {
      field: "validated",
      headerName: "Validation Status",
      width: 150,
      sortable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 220,
      sortable: true,
      valueGetter: (params) => params?.name,
    },
  ];

  return (
    <>
      <Box>
        <Paper sx={{ mb: "12px" }}>
          <UserSearchBar
            placeholder="Search by name or email"
            onSearchChange={handleSearchChange}
            delay={400}
          />
        </Paper>
        <Paper sx={{ width: "100%" }}>
          <DataGrid
            loading={loading}
            onRowSelectionModelChange={(newSelection) =>
              setRowSelectionModel(newSelection)
            }
            rowSelectionModel={rowSelectionModel}
            showToolbar
            slots={{ toolbar: ToolBar }}
            slotProps={{
              toolbar: {
                rowSelectionModel,
                totalRowCount: totalUsers,
                onUsersDelete: handleUsersDelete,
                onUsersRoleChange: handleUsersRoleChange,
                roleData,
              },
            }}
            rows={userData}
            rowCount={totalUsers}
            columns={columns}
            getRowId={(row) => row.email}
            pageSizeOptions={[50, 100, 1000]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            disableColumnResize
            disableRowSelectionOnClick
            checkboxSelection
            sx={{
              border: 0,
              p: 1,
              // Removes cell outline.
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
                {
                  outline: "none",
                },
              "& .MuiDataGrid-filler, & .MuiDataGrid-columnHeader": {
                backgroundColor: "#f1f1f1f1",
              },
            }}
          />
        </Paper>
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        title={"Confirm Role Change"}
        message={
          <>
            Are you sure you want to change the role of{" "}
            <b>{getSelectedEmails().length}</b> user(s) to
            <b> {roleData.find((role) => role.id === newRole)?.name}</b>?
          </>
        }
        confirmText={"Confirm"}
        cancelText={"Cancel"}
        confirmColor={"primary"}
        cancelColor={"error"}
        confirm={confirmRoleChange}
        cancel={() => {
          setDialogOpen(false);
          setNewRole(null);
        }}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${Array.isArray(userToDelete) ? `${userToDelete.length} user(s)` : userToDelete?.fullName}? This action cannot be undone.`}
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserManagementTable;
