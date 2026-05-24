import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../components/dialog/confirmationDialog";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

/**
 * A page used to display a list of all patients for a merchant user.
 *
 * @returns {@mui.material.Box}
 */
const PatientManagement = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [patientData, setPatientData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [totalPatients, setTotalPatients] = useState(0);

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
  const fetchPatients = useCallback(() => {
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
      })
      .catch((err) => {
        console.log("An error has occurred", err);
      });
  }, [
    API_BASE,
    paginationModel.page,
    paginationModel.pageSize,
    givenNameInput,
    familyNameInput,
  ]);

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

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: 5,
        alignItems: "center",
        ml: "65px",
        mt: "66px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1600px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={1} sx={{ width: "100%", mb: 3 }}>
          <Typography variant={isMobile ? "h5" : "h3"}>
            Patient Management
          </Typography>
          <Divider />
        </Stack>

        <Paper
          sx={{
            mb: "16px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              flex: 1,
              mx: 1,
              py: 1,
            }}
          >
            <TextField
              variant="standard"
              size="small"
              placeholder="Search by given names"
              value={givenNameInput}
              onChange={(e) => setGivenNameInput(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
              }}
            />
            <Divider
              sx={{
                display: { xs: "block", md: "none" },
              }}
            />
            <TextField
              variant="standard"
              size="small"
              placeholder="Search by last name"
              value={familyNameInput}
              onChange={(e) => setFamilyNameInput(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", md: "block" },
            }}
          />
          <Divider
            sx={{
              display: { xs: "block", md: "none" },
            }}
          />

          <Box
            sx={{
              p: 1,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 1,
              justifyContent: { sm: "flex-end" },
            }}
          >
            <Button
              id="add-patient-button"
              variant="contained"
              disableElevation
              sx={{ width: { xs: "100%", sm: "auto" } }}
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

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={patientData}
              columns={columns}
              rowCount={totalPatients}
              getRowId={(row) => row.patientId}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
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
