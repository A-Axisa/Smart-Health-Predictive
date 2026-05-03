import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../components/confirmationDialog";

import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/**
 * A page used to display a list of all patients for a merchant user.
 */
const PatientManagement = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [givenNameInput, setGivenNameInput] = useState("");
  const [familyNameInput, setFamilyNameInput] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      field: "givenNames",
      headerName: "Given Names",
      flex: 0.5,
      sortable: true,
    },
    { field: "familyName", headerName: "Last Name", flex: 0.5, sortable: true },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 120,
      sortable: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      sortable: true,
    },
    {
      field: "details",
      headerName: "View Details",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button onClick={(e) => navigate(`/patient-details/${params.id}`)}>
          <VisibilityIcon />
        </Button>
      ),
    },
    {
      field: "remove",
      headerName: "Remove Patient",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPatientID(params.id);
            setDeleteDialogOpen(true);
          }}
        >
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchPatients();
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    givenNameInput,
    familyNameInput,
  ]);

  // Debounce given name input
  useEffect(() => {
    const timer = setTimeout(() => {
      // resetting page to 0 when filter changes
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setGivenNameInput(givenNameInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [givenNameInput]);

  // Debounce last name input
  useEffect(() => {
    const timer = setTimeout(() => {
      // resetting page to 0 when filter changes
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setFamilyNameInput(familyNameInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [familyNameInput]);

  const fetchPatients = () => {
    setLoading(true);
    const params = new URLSearchParams({
      skip: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize,
    });

    if (givenNameInput) params.append("given_names", givenNameInput);
    if (familyNameInput) params.append("family_name", familyNameInput);

    fetch(`${API_BASE}/merchant/associated-patients?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setPatientData(data.patients || []);
        setTotalPatients(data.totalPatients || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log("An error has occurred");
        setLoading(false);
      });
  };

  async function handleDelete(patientID) {
    await fetch(`${API_BASE}/remove-patient/${patientID}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => response.json())
      .catch((err) => {
        console.log("An error has occurred");
      });
    fetchPatients();
    setDeleteDialogOpen(false);
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: 5,
        alignItems: "center",
        ml: "250px",
        mt: "66px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            textAlign: "center",
            mb: 2,
          }}
        >
          Patient Management
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Search by Given Names"
              variant="outlined"
              size="small"
              value={givenNameInput}
              onChange={(e) => setGivenNameInput(e.target.value)}
              sx={{ width: 300 }}
            />
            <TextField
              label="Search by Last Name"
              variant="outlined"
              size="small"
              value={familyNameInput}
              onChange={(e) => setFamilyNameInput(e.target.value)}
              sx={{ width: 300 }}
            />
            <Button
              id="add-patient-button"
              variant="contained"
              disableElevation
              sx={{ ml: "auto" }}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Add Patient
            </Button>
            <Menu
              id="demo-customized-menu"
              slotProps={{
                list: {
                  "aria-labelledby": "demo-customized-button",
                },
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => navigate("/create-patient")}
                disableRipple
              >
                Create New Patient
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/request-patient-access")}
                disableRipple
              >
                Request Patient Access
              </MenuItem>
            </Menu>
          </Box>
        </Paper>

        <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={patientData}
            columns={columns}
            rowCount={totalPatients}
            getRowId={(row) => row.patientId}
            paginationModel={paginationModel}
            pageSizeOptions={[25, 50]}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            disableColumnResize
            disableRowSelectionOnClick
          />
        </Paper>
        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Confirm Patient Access Removal"
          message={`Are you sure you want to remove your access to this patient's record? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          cancelColor="primary"
          confirm={() => handleDelete(selectedPatientID)}
          cancel={() => setDeleteDialogOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default PatientManagement;
