import { Box, Typography, Button, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../components/confirmationDialog";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

/**
 * A page used to display a list of all patients for a merchant user.
 */
const PatientManagement = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [givenNameInput, setGivenNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  const columns = [
    {
      field: "givenNames",
      headerName: "Given Names",
      flex: 0.5,
      sortable: true,
    },
    { field: "lastName", headerName: "Last Name", flex: 0.5, sortable: true },
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
  }, []);

  const fetchPatients = () => {
    fetch(`${API_BASE}/merchant/associated-patients`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const patients = data.map((patient) => ({
          id: patient.patient_id,
          givenNames: patient.given_names,
          lastName: patient.family_name,
          gender: patient.gender === 0 ? "Female" : "Male",
          dateOfBirth: new Date(patient.date_of_birth).toLocaleDateString(
            "en-AU",
          ),
        }));
        setPatientData(patients);
      })
      .catch(console.log);
  };

  async function handleDelete(patientID) {
    await fetch(`${API_BASE}/remove-patient/${patientID}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
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
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              sx={{ ml: "auto" }}
              onClick={() => navigate("/create-patient")}
            >
              Create New Patient
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={patientData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25]}
            disableRowSelectionOnClick
            disableColumnResize
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
