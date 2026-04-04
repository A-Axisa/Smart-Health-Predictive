import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Stack,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
  Radio,
  RadioGroup,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";

const FULL_NAME_MAX_LENGTH = 255;

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const CreatePatientForm = () => {
  const navigate = useNavigate();
  const [givenNameState, setGivenNameState] = useState(null);
  const [familyNameState, setFamilyNameState] = useState(null);
  const [DoBState, setDoBState] = useState(null);
  const [genderState, setGenderState] = useState("");
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
    setGivenNameState({ isValid: isNameValid, name: e.target.value });
    setAlertGivenNameRequired(!isNameValid);
  }
  function updateFamilyName(e) {
    const isNameValid = e.target.value !== "";
    setFamilyNameState({ isValid: isNameValid, name: e.target.value });
    setAlertFamilyNameRequired(!isNameValid);
  }
  function updateDoB(e) {
    setAlertDoBRequired(false);
    setDoBState(e.target.value);
  }

  function updateGender(e) {
    setAlertGenderRequired(false);
    setGenderState(e.target.value);
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
    setAlertGivenNameRequired(
      givenNameState === null || !givenNameState.isValid,
    );
    setAlertFamilyNameRequired(
      familyNameState === null || !familyNameState.isValid,
    );
    setAlertGenderRequired(genderState === "");
    setAlertDoBRequired(DoBState === null);
    setAlertWeightRequired(weight === null || !weight.isValid);
    setAlertHeightRequired(height === null || !height.isValid);
  }

  function isAllInputsValid() {
    return (
      givenNameState !== null &&
      givenNameState.isValid &&
      familyNameState !== null &&
      familyNameState.isValid &&
      DoBState !== null &&
      genderState !== "" &&
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
    const payload = {
      given_names: givenNameState,
      family_name: familyNameState,
      date_of_birth: DoBState,
      gender: genderState,
      weight: weight.value,
      height: height.value,
    };

    console.log("Create Patient Payload:", payload);

    // Post the fetch request with the supplied details.
    await fetch(`${API_BASE}/create-patient`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        given_names: givenNameState.name,
        family_name: familyNameState.name,
        date_of_birth: DoBState,
        gender: genderState,
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
      .then((data) => {
        setShowSuccessMessage(true);
        setShowFailMessage(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }

  return (
    <Container
      sx={{
        borderRadius: { xs: 0, sm: 2 },
        padding: "25px",
        alignItems: "center",
        boxShadow: 24,
        backgroundColor: "#ffffff",
        width: { xs: "auto", sm: "500px" },
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
        <Stack spacing={{ xs: 2 }}>
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
          ></TextField>

          <TextField
            id="outlined-familyName-input"
            name="family_name"
            label="Family Name"
            onChange={updateFamilyName}
            slotProps={{ htmlInput: { maxLength: FULL_NAME_MAX_LENGTH } }}
            error={alertFamilyNameRequired}
            helperText={alertFamilyNameRequired ? "*Required" : null}
          ></TextField>
          <TextField
            label="Select Date of Birth"
            name="date_of_birth"
            type="date"
            onChange={updateDoB}
            error={alertDoBRequired}
            helperText={alertDoBRequired ? "*Required" : null}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <FormControl error={alertGenderRequired}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender-required"
              value={genderState}
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
          />

          <TextField
            name="height"
            label="Height (cm)"
            type="text"
            fullWidth
            onChange={updateHeight}
            error={alertHeightRequired}
            helperText={
              alertHeightRequired
                ? "*Please enter a valid height (0-300cm)"
                : null
            }
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
    </Container>
  );
};

export default CreatePatientForm;
