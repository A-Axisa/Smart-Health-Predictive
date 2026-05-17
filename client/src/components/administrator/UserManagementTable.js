import { Paper, Box, Snackbar, Alert, Stack, Typography, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import ConfirmationDialog from "../confirmationDialog";
import UserSearchBar from "./UserSearchBar";
import UserToolBar from "./UserToolBar";
import * as React from "react";

const UserManagementTable = () => {
  const [userData, setUserData] = useState([]); // Stores user data
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);
  const [newRole, setNewRole] = useState(null); // Temp store for the pending role
  const [dialogOpen, setDialogOpen] = useState(false); // Determines dialog visibility
  const [roleData, setRoleData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");
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
    if (selectedClinic) {
      params.append("clinic_id", selectedClinic);
    }
      
    // Append sort params when sort is active
    if (sortModel.length > 0) {
      params.append("sort_by", sortModel[0].field);
      params.append("sort_order", sortModel[0].sort || "desc");
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
    selectedClinic,
    sortModel,
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

    useEffect(() => {
    fetch(`${API_BASE}/clinics`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => setClinicData(data))
      .catch(() => {
        console.log("Failed to fetch Clinics");
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
              credentials: "include",
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

  const handleClinicChange = (clinicId) => {
    setSelectedClinic(clinicId);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = useCallback((value) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setDebouncedSearchQuery(value);
  }, []);

  const handleSortModelChange = useCallback((newSortModel) => {
    setSortModel(newSortModel);
    // Reset to first page whene sort changes
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const columns = [
    { field: "email", headerName: "Email", flex: 2, width: 250, sortable: true },
    { field: "fullName", headerName: "Full Name", flex: 1.5, width: 250, sortable: false },
    { field: "createdAt", headerName: "Created At", flex: 1.2, width: 200, sortable: true },
    { field: "validated", headerName: "Validation Status", flex: 1, width: 150, sortable: true },
    { field: "role", headerName: "Role", flex: 1.3, width: 220, sortable: false, valueGetter: (params) => params?.name },
  ];

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
      <Box>
        <Paper sx={{
          mb: "16px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          }}
        >
          <UserSearchBar
            placeholder="Search by name or email"
            onSearchChange={handleSearchChange}
            delay={400}
          />
          <Divider
          orientation="vertical"
          flexItem sx={{
            display: { xs: "none", md: "block" },
            }} 
          />
          <Divider
            sx={{
              display: { xs: "block", md: "none" },
            }}
          />
            <UserToolBar
              rowSelectionModel={rowSelectionModel}
              totalRowCount={totalUsers}
              onUsersDelete={handleUsersDelete}
              onUsersRoleChange={handleUsersRoleChange}
              onClinicChange={handleClinicChange}
              roleData={roleData}
              clinicData={clinicData}
              selectedClinic={selectedClinic}
            />
        </Paper>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Box sx={{ width: "100%", overflowX: "auto"}}>
            <DataGrid
              loading={loading}
              onRowSelectionModelChange={(newSelection) =>
                setRowSelectionModel(newSelection)
              }
              rowSelectionModel={rowSelectionModel}
              rows={userData}
              rowCount={totalUsers}
              columns={columns}
              getRowId={(row) => row.email}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              checkboxSelection
            />
          </Box>
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
    </Box>
  );
};

export default UserManagementTable;
