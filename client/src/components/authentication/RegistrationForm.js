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

  // Retrieve Clinic Names
  useEffect(() => {
    fetch(`${API_BASE}/getClinicNames/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setClinicList(data))
      .catch((err) => console.log(err));
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
    setAccountType(e.target.value);
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
    setIsLoading(true);
    // Post the fetch request with the supplied details.
    await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        given_names: givenNameState ? givenNameState.name : "",
        family_name: familyNameState ? familyNameState.name : "",
        date_of_birth: DoBState,
        gender: genderState,
        password: passwordState.password,
        email: emailState.email,
        phone: phoneState !== null ? phoneState.phone : "",
        account_type: e.target.account_type.value,
        clinic_id: accountType === ACCOUNT_TYPES.STANDARD ? null : clinicState,
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
        <DialogTitle>{"Account Creation Successful!"}</DialogTitle>
        <DialogContent>
          <Typography>
            A verification email has been sent to your inbox. Please check your
            email to complete the registration process.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessage} autoFocus>
            Back to login
          </Button>
        </DialogActions>
      </Dialog>

      <Container component="form" onSubmit={handleRegistration}>
        <Stack spacing={{ xs: 2 }}>
          {generateUnsuccessfulCreationAlert()}
          <Divider
            variant="middle"
            aria-hidden="true"
            sx={{ fontWeight: "bold", py: "5px" }}
          >
            Account Type
          </Divider>
          <Container display="flex" justifyContent="center">
            <RadioGroup
              row
              defaultValue={ACCOUNT_TYPES.STANDARD}
              name="account_type"
              align="center"
              sx={{ gap: 5 }}
              onChange={updateAccountType}
            >
              <FormControlLabel
                value={ACCOUNT_TYPES.STANDARD}
                control={<Radio />}
                label="Standard User"
              />
              <FormControlLabel
                value={ACCOUNT_TYPES.MERCHANT}
                control={<Radio />}
                label="Merchant"
              />
            </RadioGroup>
          </Container>

          <Divider
            variant="middle"
            aria-hidden="true"
            sx={{ fontWeight: "bold", py: "5px" }}
          >
            Details
          </Divider>
          {accountType === ACCOUNT_TYPES.STANDARD && (
            <>
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
                helperText={
                  alertDoBRequired ? "*You must be at least 18 years old" : null
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
            </>
          )}
          {accountType === ACCOUNT_TYPES.MERCHANT && (
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
                  <MenuItem key={clinic.clinic_name} value={clinic.clinic_id}>
                    {clinic.clinic_name}
                  </MenuItem>
                ))}
              </Select>
              {alertClinicRequired && (
                <FormHelperText>*Required</FormHelperText>
              )}
            </FormControl>
          )}
          <PhoneInputField onChange={setPhoneState} />
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

          <Button
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{
              py: { xs: "1rem", sm: ".9rem" },
              fontSize: { xs: "1.2rem", sm: "1rem" },
            }}
          >
            Create Account
          </Button>
          <Stack
            direction="row"
            spacing={{ xs: 1 }}
            style={{ justifyContent: "center" }}
          >
            <Typography
              noWrap={true}
              align="center"
              style={{ color: "#888888" }}
            >
              Already have an account?
            </Typography>
            <Link href="/login" align="center" fontWeight="bold">
              Log in
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Container>
  );
};

export default RegistrationForm;
