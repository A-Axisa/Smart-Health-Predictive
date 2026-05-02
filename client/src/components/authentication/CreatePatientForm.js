import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Stack,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Typography,
} from "@mui/material";

const FULL_NAME_MAX_LENGTH = 255;

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const CreatePatientForm = () => {
  const navigate = useNavigate();
  const [givenNames, setGivenNames] = useState(null);
  const [familyName, setFamilyName] = useState(null);
  const [DoB, setDoB] = useState(null);
  const [gender, setGender] = useState("");
  const [alertGivenNameRequired, setAlertGivenNameRequired] = useState(false);
  const [alertFamilyNameRequired, setAlertFamilyNameRequired] = useState(false);
  const [alertDoBRequired, setAlertDoBRequired] = useState(false);
  const [alertGenderRequired, setAlertGenderRequired] = useState(false);
  const [weight, setWeight] = useState(null);
  const [alertWeightRequired, setAlertWeightRequired] = useState(false);
  const [height, setHeight] = useState(null);
  const [alertHeightRequired, setAlertHeightRequired] = useState(false);

  const [showFailMessage, setShowFailMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function updateGivenName(e) {
    const isNameValid = e.target.value !== "";
    setGivenNames({ isValid: isNameValid, name: e.target.value });
    setAlertGivenNameRequired(!isNameValid);
  }

  function updateFamilyName(e) {
    const isNameValid = e.target.value !== "";
    setFamilyName({ isValid: isNameValid, name: e.target.value });
    setAlertFamilyNameRequired(!isNameValid);
  }

  function updateDoB(e) {
    if (calculateAge(e.target.value) < 18) {
      setAlertDoBRequired(true);
    } else {
      setAlertDoBRequired(false);
    }
    setDoB(e.target.value);
  }

  function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    const yearDiff = today.getFullYear() - birthDate.getFullYear();
    const birthdayNotPassed =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    return yearDiff - birthdayNotPassed;
  }

  function updateGender(e) {
    setAlertGenderRequired(false);
    setGender(e.target.value);
  }

  function updateWeight(e) {
    const weightValue = e.target.value;
    const isWeightValid =
      weightValue !== "" && weightValue >= 0 && weightValue <= 200;
    setWeight({ isValid: isWeightValid, value: weightValue });
    setAlertWeightRequired(!isWeightValid);
  }

  function updateHeight(e) {
    const heightValue = e.target.value;
    const isHeightValid =
      heightValue !== "" && heightValue >= 0 && heightValue <= 300;
    setHeight({ isValid: isHeightValid, value: heightValue });
    setAlertHeightRequired(!isHeightValid);
  }

  function updateAllInputFieldAlerts() {
    setAlertGivenNameRequired(givenNames === null || !givenNames.isValid);
    setAlertFamilyNameRequired(familyName === null || !familyName.isValid);
    setAlertGenderRequired(gender === "");
    setAlertDoBRequired(DoB === null || calculateAge(DoB) < 18);
    setAlertWeightRequired(weight === null || !weight.isValid);
    setAlertHeightRequired(height === null || !height.isValid);
  }

  function isAllInputsValid() {
    return (
      givenNames !== null &&
      givenNames.isValid &&
      familyName !== null &&
      familyName.isValid &&
      DoB !== null &&
      calculateAge(DoB) >= 18 &&
      gender !== "" &&
      weight !== "" &&
      weight.isValid &&
      height !== "" &&
      height.isValid
    );
  }

  function generateUnsuccessfulCreationAlert() {
    if (showFailMessage) {
      return (
        <Alert variant="filled" severity="error">
          Patient creation unsuccessful.
        </Alert>
      );
    }
    return null;
  }

  function handleCloseMessage() {
    setShowSuccessMessage(false);
    navigate("/patient-management");
  }

  async function handlePatientCreation(e) {
    e.preventDefault();

    updateAllInputFieldAlerts();
    if (!isAllInputsValid()) {
      return;
    }
    setIsLoading(true);
    await fetch(`${API_BASE}/create-patient`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        given_names: givenNames.name,
        family_name: familyName.name,
        date_of_birth: DoB,
        gender: gender,
        weight: weight.value,
        height: height.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          setShowFailMessage(true);
        }
        return response.json();
      })
      .then(() => {
        setShowSuccessMessage(true);
        setShowFailMessage(false);
      })
      .catch(() => {
        console.log("An error has occurred");
      });
    setIsLoading(false);
  }

  return (
    <Paper
      sx={{
        borderRadius: { xs: 0, sm: 2 },
        padding: { xs: 3, sm: 4 },
        alignItems: "center",
        width: { xs: "100%", sm: "560px" },
        flexGrow: { xs: 1, sm: 0 },
      }}
    >
      <Dialog open={showSuccessMessage}>
        <DialogTitle>{"Patient Creation Successful!"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseMessage} autoFocus>
            Back to Patient Management
          </Button>
        </DialogActions>
      </Dialog>

      <Container component="form" onSubmit={handlePatientCreation}>
        <Stack spacing={2}>
          <Stack spacing={1} sx={{ textAlign: "center" }}>
            <Typography variant="h4">Create Patient</Typography>
            <Typography variant="body2" color="text.secondary">
              Enter patient details to create a new record.
            </Typography>
          </Stack>

          {generateUnsuccessfulCreationAlert()}

          <Divider
            variant="middle"
            aria-hidden="true"
            sx={{ fontWeight: "bold", py: "5px" }}
          >
            Patient Details
          </Divider>

          <TextField
            id="outlined-givenName-input"
            name="given_names"
            label="Given Names"
            onChange={updateGivenName}
            slotProps={{ htmlInput: { maxLength: FULL_NAME_MAX_LENGTH } }}
            error={alertGivenNameRequired}
            helperText={alertGivenNameRequired ? "*Required" : null}
            fullWidth
          />

          <TextField
            id="outlined-familyName-input"
            name="family_name"
            label="Family Name"
            onChange={updateFamilyName}
            slotProps={{ htmlInput: { maxLength: FULL_NAME_MAX_LENGTH } }}
            error={alertFamilyNameRequired}
            helperText={alertFamilyNameRequired ? "*Required" : null}
            fullWidth
          />

          <TextField
            label="Select Date of Birth"
            name="date_of_birth"
            type="date"
            onChange={updateDoB}
            error={alertDoBRequired}
            helperText={
              alertDoBRequired ? "Patient must be 18 years or older" : null
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
          />

          <FormControl error={alertGenderRequired} fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender-required"
              value={gender}
              onChange={updateGender}
              label="Gender"
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
            {alertGenderRequired && <FormHelperText>*Required</FormHelperText>}
          </FormControl>

          <TextField
            name="weight"
            label="Weight (Kg)"
            type="text"
            onChange={updateWeight}
            error={alertWeightRequired}
            helperText={
              alertWeightRequired
                ? "*Please enter a valid weight (0-200kg)"
                : null
            }
            fullWidth
          />

          <TextField
            name="height"
            label="Height (cm)"
            type="text"
            onChange={updateHeight}
            error={alertHeightRequired}
            helperText={
              alertHeightRequired
                ? "*Please enter a valid height (0-300cm)"
                : null
            }
            fullWidth
          />

          <Button
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{
              py: { xs: "1rem", sm: ".9rem" },
              fontSize: { xs: "1.2rem", sm: "1rem" },
            }}
          >
            Create Patient
          </Button>

          <Stack
            direction="row"
            spacing={{ xs: 1 }}
            style={{ justifyContent: "center" }}
          ></Stack>
        </Stack>
      </Container>
    </Paper>
  );
};

export default CreatePatientForm;
