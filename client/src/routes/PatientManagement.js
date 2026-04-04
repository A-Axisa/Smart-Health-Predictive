import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../components/confirmationDialog";

import DeleteIcon from "@mui/icons-material/Delete";

/**
 * A page used to display a list of all patients for a merchant user.
 */
const PatientManagement = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatientID, setSelectedPatientID] = useState(null);

  const columns = [
    {
      field: "givenNames",
      headerName: "Given Names",
      flex: 1,
      sortable: true,
    },
    { field: "lastName", headerName: "Last Name", flex: 1, sortable: true },
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
      field: "remove",
      headerName: "",
      width: 100,
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
        ml: "250px",
        mt: "66px",
      }}
    >
      <Button
        variant="contained"
        sx={{ mb: 2, mx: 2 }}
        onClick={() => navigate("/create-patient")}
      >
        Create New Patient
      </Button>
      <Box sx={{ height: 400, mx: 2 }}>
        <DataGrid
          rows={patientData}
          columns={columns}
          onRowClick={(params) => navigate(`/patient-details/${params.id}`)}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[25]}
          disableRowSelectionOnClick
        />
      </Box>
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
  );
};

export default PatientManagement;
