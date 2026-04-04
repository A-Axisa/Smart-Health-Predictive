import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * A page used to display a list of all patients for a merchant user.
 */
const PatientManagement = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState([]);

  const columns = [
    {
      field: "givenNames",
      headerName: "Given Names",
      width: 250,
      sortable: true,
    },
    { field: "lastName", headerName: "Last Name", width: 250, sortable: true },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 150,
      sortable: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      sortable: true,
    },
  ];

  useEffect(() => {
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
            "Aus",
          ),
        }));

        setPatientData(patients);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box
      sx={{
        ml: "250px",
        mt: "66px",
      }}
    >
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
    </Box>
  );
};

export default PatientManagement;
