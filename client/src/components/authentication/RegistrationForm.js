import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
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
  Card,
  CardContent,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PasswordInputField from "../authentication/PasswordInputField";
import EmailInputField from "../authentication/EmailInputField";
import PhoneInputField from "../authentication/PhoneInputField";

const FULL_NAME_MAX_LENGTH = 255;
const ACCOUNT_TYPES = Object.freeze({
  STANDARD: "user",
  MERCHANT: "merchant",
});

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [givenNameState, setGivenNameState] = useState(null);
  const [familyNameState, setFamilyNameState] = useState(null);
  const [DoBState, setDoBState] = useState(null);
  const [genderState, setGenderState] = useState("");
  const [emailState, setEmailState] = useState(null);
  const [phoneState, setPhoneState] = useState(null);
  const [passwordState, setPasswordState] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertGivenNameRequired, setAlertGivenNameRequired] = useState(false);
  const [alertFamilyNameRequired, setAlertFamilyNameRequired] = useState(false);
  const [alertDoBRequired, setAlertDoBRequired] = useState(false);
  const [alertGenderRequired, setAlertGenderRequired] = useState(false);
  const [alertEmailRequired, setAlertEmailRequired] = useState(false);
  const [alertPasswordRequired, setAlertPasswordRequired] = useState(false);
  const [alertPasswordsDontMatch, setAlertPasswordsDontMatch] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES.STANDARD);
  const [clinicList, setClinicList] = useState();
  const [clinicState, setClinicState] = useState("");
  const [alertClinicRequired, setAlertClinicRequired] = useState(false);
  const [isAccountTypeSelected, setIsAccountTypeSelected] = useState(false);

  // Retrieve Clinic Names
  useEffect(() => {
    fetch(`${API_BASE}/get-clinic-names/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setClinicList(data))
      .catch((err) => console.log("An error has occurred"));
  }, []);

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
    if (calculateAge(e.target.value) < 18) {
      setAlertDoBRequired(true);
    } else {
      setAlertDoBRequired(false);
    }
    setDoBState(e.target.value);
  }

  function calculateAge(DoB) {
    // Format dates
    const today = new Date();
    const dob = new Date(DoB);
    // calculate the year different between today and the dob
    const yearDiff = today.getFullYear() - dob.getFullYear();

    // Check if the users birthday has past
    const birthdayNotPassed =
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());

    const age = yearDiff - birthdayNotPassed;
    return age;
  }

  function updateEmail(e) {
    setAlertEmailRequired(false);
    setEmailState(e);
  }

  function updatePassword(e) {
    setAlertPasswordRequired(false);
    setPasswordState(e);
    setAlertPasswordsDontMatch(
      confirmPassword !== e.password || e.password === "",
    );
  }

  function updateConfirmPassword(e) {
    const confirmPasswordInput = e.target.value;
    setConfirmPassword(confirmPasswordInput);
    setAlertPasswordsDontMatch(
      confirmPasswordInput !== passwordState.password ||
        confirmPasswordInput === "",
    );
  }

  function updateGender(e) {
    setAlertGenderRequired(false);
    setGenderState(e.target.value);
  }

  function updateAccountType(e) {
    console.log(e.target.value);
    setAccountType(e.target.value);
  }

  function setAccountTypeToStandard() {
    setAccountType(ACCOUNT_TYPES.STANDARD);
    setIsAccountTypeSelected(true);
  }

  function setAccountTypeToMerchant() {
    setAccountType(ACCOUNT_TYPES.MERCHANT);
    setIsAccountTypeSelected(true);
  }

  function goToAccountTypeSelection() {
    setIsAccountTypeSelected(false);
    resetPersistantInputDetails();
  }

  function resetPersistantInputDetails() {
    setGenderState(null);
    setAlertGenderRequired(false);
    setClinicState(null);
    setAlertClinicRequired(false);
  }

  function updateClinic(e) {
    setAlertClinicRequired(false);
    setClinicState(e.target.value);
  }

  function updateAllStandardInputFieldAlerts() {
    setAlertGivenNameRequired(
      givenNameState === null || !givenNameState.isValid,
    );
    setAlertFamilyNameRequired(
      familyNameState === null || !familyNameState.isValid,
    );
    setAlertEmailRequired(emailState === null);
    setAlertPasswordRequired(passwordState === null);
    setAlertPasswordsDontMatch(
      passwordState === null ||
        confirmPassword !== passwordState.password ||
        confirmPassword === "",
    );
    setAlertGenderRequired(genderState === "");
    setAlertDoBRequired(DoBState === null || calculateAge(DoBState) < 18);
  }

  function updateAllMerchantInputFieldAlerts() {
    setAlertEmailRequired(emailState === null);
    setAlertPasswordRequired(passwordState === null);
    setAlertPasswordsDontMatch(
      passwordState === null ||
        confirmPassword !== passwordState.password ||
        confirmPassword === "",
    );
    setAlertClinicRequired(clinicState === "");
  }

  function isAllStandardInputsValid() {
    return (
      givenNameState !== null &&
      givenNameState.isValid &&
      familyNameState !== null &&
      familyNameState.isValid &&
      DoBState !== null &&
      calculateAge(DoBState) >= 18 &&
      genderState !== "" &&
      emailState !== null &&
      emailState.isValid &&
      (phoneState === null || phoneState.isValid) &&
      passwordState !== null &&
      passwordState.isValid &&
      passwordState.password === confirmPassword
    );
  }

  function isAllMerchantInputsValid() {
    return (
      emailState !== null &&
      emailState.isValid &&
      (phoneState === null || phoneState.isValid) &&
      passwordState !== null &&
      passwordState.isValid &&
      passwordState.password === confirmPassword &&
      clinicState !== ""
    );
  }

  function generateUnsuccessfulCreationAlert() {
    if (showFailMessage) {
      return (
        <Alert variant="filled" severity="error">
          Account creation unsuccessful.
        </Alert>
      );
    }
    return null;
  }

  function handleCloseMessage() {
    setShowSuccessMessage(false);
    navigate("/login");
  }

  async function handleRegistration(e) {
    e.preventDefault();
    // Show error message for empty required fields.
    if (accountType === ACCOUNT_TYPES.STANDARD) {
      updateAllStandardInputFieldAlerts();
      if (!isAllStandardInputsValid()) {
        return;
      }
    }
    if (accountType === ACCOUNT_TYPES.MERCHANT) {
      updateAllMerchantInputFieldAlerts();
      if (!isAllMerchantInputsValid()) {
        return;
      }
    }

    console.log(e.target.account_type);
    // setIsLoading(true);
    // Post the fetch request with the supplied details.
    await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        givenNames: givenNameState ? givenNameState.name : "",
        familyName: familyNameState ? familyNameState.name : "",
        dateOfBirth: DoBState,
        gender: genderState,
        password: passwordState.password,
        email: emailState.email,
        phone: phoneState !== null ? phoneState.phone : "",
        accountType: accountType,
        clinicId: accountType === ACCOUNT_TYPES.STANDARD ? null : clinicState,
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
    <Card
      component="form"
      onSubmit={handleRegistration}
      sx={{
        alignItems: "center",
        width: "auto",
        minHeight: { xs: "100vh", sm: "auto" },
        flexGrow: { xs: 1, sm: 0 },
        margin: { xs: "0px", sm: "60px" },
      }}
    >
      <CardContent>
        {/* Success Dialog */}
        <Dialog open={showSuccessMessage}>
          <DialogTitle>Account Creation Successful!</DialogTitle>
          <DialogContent>
            <Typography>
              A verification email has been sent to your inbox. Please check
              your email to complete the registration process.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseMessage} autoFocus>
              Back to login
            </Button>
          </DialogActions>
        </Dialog>

        {/* Account Type Selection*/}
        {!isAccountTypeSelected && (
          <Box>
            <Stack alignItems="center" spacing={3}>
              <Stack alignItems="center" spacing={1} paddingBottom={1}>
                <Typography variant="h4">Account Type</Typography>
                <Typography variant="subtle">
                  Select which type of account you want to create
                </Typography>
              </Stack>
              <Button
                variant="contained"
                onClick={setAccountTypeToStandard}
                sx={{
                  py: { xs: "1rem", sm: ".9rem" },
                  fontSize: "1rem",
                  width: "300px",
                  height: "100px",
                  justifyContent: "flex-start",
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 60 }} />
                Personal
              </Button>
              <Button
                variant="contained"
                onClick={setAccountTypeToMerchant}
                sx={{
                  py: { xs: "1rem", sm: ".9rem" },
                  fontSize: "1rem",
                  width: "300px",
                  height: "100px",
                  justifyContent: "flex-start",
                  whiteSpace: "pre",
                }}
              >
                <Stack direction="row" spacing={5} alignItems="center">
                  <AccountBalanceIcon sx={{ fontSize: 60 }} />
                  Partner
                </Stack>
              </Button>
              <Divider
                variant="middle"
                aria-hidden="true"
                sx={{ fontWeight: "bold", py: "5px", minWidth: "100%" }}
              >
                OR
              </Divider>
              <Button
                href="/login"
                variant="outlined"
                sx={{
                  py: { xs: "1rem", sm: ".9rem" },
                  fontSize: "1rem",
                }}
              >
                Return to login
              </Button>
            </Stack>
          </Box>
        )}

        {/* Details */}
        {isAccountTypeSelected && (
          <Box sx={{ width: { sm: "auto", md: "500px" } }}>
            <Stack spacing={6}>
              {/* Standard Account Details */}
              {accountType === ACCOUNT_TYPES.STANDARD && (
                <Stack spacing={2}>
                  <Stack spacing={1} paddingBottom={3}>
                    <Stack alignItems="center">
                      <AccountCircleIcon
                        justifyContent="center"
                        sx={{ fontSize: 80 }}
                      />
                    </Stack>
                    <Typography variant="h4" align="center">
                      Personal Account
                    </Typography>
                    <Typography variant="subtle" align="center">
                      Fill in your details to create an account
                    </Typography>
                  </Stack>
                  <Divider
                    variant="middle"
                    aria-hidden="true"
                    sx={{ fontWeight: "bold", py: "5px" }}
                  >
                    Personal Details
                  </Divider>
                  <TextField
                    id="outlined-givenName-input"
                    name="given_names"
                    label="Given Names"
                    onChange={updateGivenName}
                    slotProps={{
                      htmlInput: { maxLength: FULL_NAME_MAX_LENGTH },
                    }}
                    error={alertGivenNameRequired}
                    helperText={alertGivenNameRequired ? "*Required" : null}
                  ></TextField>

                  <TextField
                    id="outlined-familyName-input"
                    name="family_name"
                    label="Family Name"
                    onChange={updateFamilyName}
                    slotProps={{
                      htmlInput: { maxLength: FULL_NAME_MAX_LENGTH },
                    }}
                    error={alertFamilyNameRequired}
                    helperText={alertFamilyNameRequired ? "*Required" : null}
                  ></TextField>
                  <TextField
                    label="Select Date of Birth"
                    name="date_of_birth"
                    type="date"
                    onChange={updateDoB}
                    error={alertDoBRequired}
                    helperText={
                      alertDoBRequired
                        ? "*You must be at least 18 years old"
                        : null
                    }
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
                    {alertGenderRequired && (
                      <FormHelperText>*Required</FormHelperText>
                    )}
                  </FormControl>
                  <PhoneInputField onChange={setPhoneState} />
                </Stack>
              )}

              {/* Merchant Account Details */}
              {accountType === ACCOUNT_TYPES.MERCHANT && (
                <Stack spacing={2}>
                  <Stack alignItems="center" spacing={1} paddingBottom={3}>
                    <Stack alignItems="center">
                      <AccountBalanceIcon
                        justifyContent="center"
                        sx={{ fontSize: 80 }}
                      />
                    </Stack>
                    <Typography variant="h4">Partner Account</Typography>
                    <Typography variant="subtle">
                      Fill in your details to create an account
                    </Typography>
                  </Stack>
                  <Divider
                    variant="middle"
                    aria-hidden="true"
                    sx={{ fontWeight: "bold", py: "5px" }}
                  >
                    Partner Details
                  </Divider>
                  <FormControl fullWidth error={alertClinicRequired}>
                    <InputLabel id="clinic-select-label">Clinic</InputLabel>
                    <Select
                      labelId="clinic-select-label"
                      value={clinicState}
                      label={"clinic"}
                      onChange={updateClinic}
                    >
                      <MenuItem value="" disabled>
                        Select a clinic
                      </MenuItem>

                      {/* List of available clinics */}
                      {clinicList.map((clinic) => (
                        <MenuItem
                          key={clinic.clinicName}
                          value={clinic.clinicId}
                        >
                          {clinic.clinicName}
                        </MenuItem>
                      ))}
                    </Select>
                    {alertClinicRequired && (
                      <FormHelperText>*Required</FormHelperText>
                    )}
                  </FormControl>
                  <PhoneInputField onChange={setPhoneState} />
                </Stack>
              )}

              {/* Account Details */}
              <Stack spacing={2}>
                <Divider
                  variant="middle"
                  aria-hidden="true"
                  sx={{ fontWeight: "bold", py: "5px" }}
                >
                  Account Details
                </Divider>
                <EmailInputField
                  onChange={updateEmail}
                  showRequired={alertEmailRequired}
                />
                <PasswordInputField
                  onChange={updatePassword}
                  truncate={true}
                  showRequired={alertPasswordRequired}
                />
                <TextField
                  id="outlined-password-input"
                  name="confirmPassword"
                  label="Confirm Password"
                  onChange={updateConfirmPassword}
                  type="password"
                  error={alertPasswordsDontMatch}
                  helperText={
                    alertPasswordsDontMatch ? "*Passwords do not match" : null
                  }
                ></TextField>
              </Stack>

              <Stack spacing={3}>
                <Divider
                  variant="middle"
                  aria-hidden="true"
                  sx={{ fontWeight: "bold", py: "5px" }}
                ></Divider>
                <Stack spacing={2} alignItems="center">
                  <Button
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    sx={{
                      py: "1rem",
                      fontSize: "1rem",
                      width: "100%",
                    }}
                  >
                    Create Account
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={goToAccountTypeSelection}
                    sx={{
                      py: "1rem",
                      fontSize: "1rem",
                      width: "100%",
                    }}
                  >
                    Back
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
