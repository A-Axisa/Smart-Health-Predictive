import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  OutlinedInput,
  FormControl,
  ListItemText,
  Select,
  FormHelperText,
} from "@mui/material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import BloodReportUpload from "./BloodReportUpload";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const GenerateReportForm = () => {
  const navigate = useNavigate();

  const healthConditions = [
    "Hyper Tension",
    "Heart Disease",
    "Diabetes",
    "High Cholesterol",
    "Stroke",
  ];
  const lifeStyleChoices = ["Drink Alcohol", "Current Smoker", "Former Smoker"];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [condition, setCondition] = useState([]);
  const [lifeStyle, setLifeStyle] = useState([]);

  const [weight, setWeight] = useState(null);
  const [alertWeightRequired, setAlertWeightRequired] = useState(false);
  const [age, setAge] = useState(null);
  const [alertAgeRequired, setAlertAgeRequired] = useState(false);
  const [height, setHeight] = useState(null);
  const [alertHeightRequired, setAlertHeightRequired] = useState(false);
  const [gender, setGender] = useState(null);
  const [alertGenderRequired, setAlertGenderRequired] = useState(false);
  const [bloodGlucose, setBloodGlucose] = useState(null);
  const [alertBloodGlucoseRequired, setAlertBloodGlucoseRequired] =
    useState(false);
  const [apLow, setApLow] = useState(null);
  const [alertApLowRequired, setAlertApLowRequired] = useState(false);
  const [apHigh, setApHigh] = useState(null);
  const [alertApHighRequired, setAlertApHighRequired] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [alertMaritalStatusRequired, setAlertMaritalStatusRequired] =
    useState(false);
  const [workingStatus, setWorkingStatus] = useState(null);
  const [alertWorkingStatusRequired, setAlertWorkingStatusRequired] =
    useState(false);
  const [bloodGlucoseInput, setBloodGlucoseInput] = useState("");

  useEffect(() => {
    async function fetchPatientData() {
      try {
        const response = await fetch(`${API_BASE}/patient-data`, {
          method: 'GET',
          credentials: 'include',
        })
        if (!response.ok) {throw new Error(response.status);}
        const data = await response.json();

        setWeight({ isValid: true, value: data.weight });
        setHeight({ isValid: true, value: data.height });
        setGender(data.gender);
        setAge({ isValid: true, value: data.age });
      }
      catch(err) {
        console.log("Failed to fetch patient data.");
      }
    }
    fetchPatientData();
  }, []);

  function handleChangeCondition(e) {
    const {
      target: { value },
    } = e;
    setCondition(typeof value === "string" ? value.split(",") : value);
  }

  function handleChangeLifeStyle(e) {
    const {
      target: { value },
    } = e;

    let newValues = typeof value === "string" ? value.split(",") : value;
    const lastSelected = newValues[newValues.length - 1];

    // Remove former smoker if the user selects they are a current smoker
    if (
      lastSelected === "Current Smoker" &&
      newValues.includes("Former Smoker")
    ) {
      newValues = newValues.filter((smoker) => smoker !== "Former Smoker");
    }

    // Remove current smoker if the user selects they are a former smoker
    if (
      lastSelected === "Former Smoker" &&
      newValues.includes("Current Smoker")
    ) {
      newValues = newValues.filter((smoker) => smoker !== "Current Smoker");
    }
    setLifeStyle(newValues);
  }

  function updateAge(e) {
    const ageValue = Number(e.target.value);
    const isAgeValid =
      Number.isInteger(ageValue) &&
      ageValue !== "" &&
      ageValue >= 0 &&
      ageValue <= 100;
    setAge({ isValid: isAgeValid, value: ageValue });
    setAlertAgeRequired(!isAgeValid);
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

  function updateGender(e) {
    setGender(e.target.value);
    setAlertGenderRequired(false);
  }

  function updateBloodGlucose(e) {
    const bloodGlucoseValue = e.target.value;
    const isBloodGlucoseValid =
      bloodGlucoseValue !== "" &&
      bloodGlucoseValue >= 0 &&
      bloodGlucoseValue <= 20;
    setBloodGlucose({ isValid: isBloodGlucoseValid, value: bloodGlucoseValue });
    setAlertBloodGlucoseRequired(!isBloodGlucoseValid);
    setBloodGlucoseInput(bloodGlucoseValue);
  }

  function updateApLow(e) {
    const apLowValue = e.target.value;
    const isApLowValid =
      apLowValue !== "" && apLowValue >= 0 && apLowValue <= 200;
    setApLow({ isValid: isApLowValid, value: apLowValue });
    setAlertApLowRequired(!isApLowValid);
  }

  function updateApHigh(e) {
    const apHighValue = e.target.value;
    const isApHighValid =
      apHighValue !== "" && apHighValue >= 0 && apHighValue <= 200;
    setApHigh({ isValid: isApHighValid, value: apHighValue });
    setAlertApHighRequired(!isApHighValid);
  }

  function updateMaritalStatus(e) {
    setMaritalStatus(e.target.value);
    setAlertMaritalStatusRequired(false);
  }
  function updateWorkingStatus(e) {
    setWorkingStatus(e.target.value);
    setAlertWorkingStatusRequired(false);
  }

  function isAllInputsValid() {
    return (
      weight !== null &&
      weight.isValid &&
      age !== null &&
      age.isValid &&
      height !== null &&
      height.isValid &&
      gender !== null &&
      bloodGlucose !== null &&
      bloodGlucose.isValid &&
      apLow !== null &&
      apLow.isValid &&
      apHigh !== null &&
      apHigh.isValid &&
      maritalStatus !== null &&
      workingStatus !== null
    );
  }
  function updateAllInputFieldAlerts() {
    setAlertWeightRequired(weight === null || !weight.isValid);
    setAlertAgeRequired(age === null || !age.isValid);
    setAlertHeightRequired(height === null || !height.isValid);
    setAlertGenderRequired(gender === null);
    setAlertBloodGlucoseRequired(
      bloodGlucose === null || !bloodGlucose.isValid,
    );
    setAlertApLowRequired(apLow === null || !apLow.isValid);
    setAlertApHighRequired(apHigh === null || !apHigh.isValid);
    setAlertMaritalStatusRequired(maritalStatus === null);
    setAlertWorkingStatusRequired(workingStatus === null);
  }

  // Fills in fields with information found in the blood reports.
  async function readBloodReport(e) {
    if (e.aveBloodGlucose !== NaN) {
      // Value needs to be in a specific dictionary format to be validated and set.
      updateBloodGlucose({ target: { value: e.aveBloodGlucose.toString() } });
    }

    // Create a new conditions array as state arrays cannot be modified.
    let newConditions = condition.filter(
      (e) => !["Diabetes", "High Cholesterol"].includes(e),
    );
    if (e.isDiabetic) {
      newConditions.push("Diabetes");
    }
    if (e.hasHighCholesterol) {
      newConditions.push("High Cholesterol");
    }
    setCondition(newConditions);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    updateAllInputFieldAlerts();
    if (!isAllInputsValid()) {
      return;
    }
    // Get condition values for fetch request
    const hyperTension = condition.includes("Hyper Tension") ? 1 : 0;
    const heartDisease = condition.includes("Heart Disease") ? 1 : 0;
    const diabetes = condition.includes("Diabetes") ? 1 : 0;
    const highCholesterol = condition.includes("High Cholesterol") ? 1 : 0;
    const stroke = condition.includes("Stroke") ? 1 : 0;

    // Get lifestyle values for fetch request
    const alcohol = lifeStyle.includes("Drink Alcohol") ? 1 : 0;
    const smoker = lifeStyle.includes("Current Smoker")
      ? "Yes"
      : lifeStyle.includes("Former Smoker")
        ? "Former smoker"
        : "No";

    // Fetch request for AI Model
    await fetch(`${API_BASE}/healthPrediction`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age: age.value,
        weight: weight.value,
        height: height.value,
        gender: gender,
        blood_glucose: bloodGlucose.value,
        ap_hi: apHigh.value,
        ap_lo: apLow.value,
        high_cholesterol: highCholesterol,
        hyper_tension: hyperTension,
        heart_disease: heartDisease,
        diabetes: diabetes,
        alcohol: alcohol,
        smoker: smoker,
        marital_status: maritalStatus,
        working_status: workingStatus,
        stroke: stroke,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        navigate("/ai-health-prediction"); // Route the user to the Health prediction page after submission
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Card
      variant="outlined"
      sx={{ maxWidth: 800, margin: "2rem auto", padding: 2, boxShadow: 24 }}
    >
      <CardHeader
        title="Generate Report"
        sx={{
          mb: 3,
          color: "primary.main",
          fontWeight: 600,
          textAlign: "center",
        }}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            mb: 5,
          }}
        >
          <BloodReportUpload onChange={readBloodReport} />
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Age & Physique Section */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              mt: 2,
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Age & Physique
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              name="weight"
              label="Weight (Kg)"
              type="text"
              inputProps={{ step: "0.01", min: 0, max: 200, maxLength: 5 }}
              value={weight?.value || ""}
              onChange={updateWeight}
              error={alertWeightRequired}
              helperText={
                alertWeightRequired
                  ? "*Please enter a valid weight (0-200kg)"
                  : null
              }
            />

            <TextField
              name="age"
              label="Age"
              type="text"
              inputProps={{ min: 0, max: 100, maxLength: 3 }}
              fullWidth
              value={age?.value || ""}
              onChange={updateAge}
              error={alertAgeRequired}
              helperText={
                alertAgeRequired ? "*Please enter a valid age (0-100)" : null
              }
            />

            <TextField
              name="height"
              label="Height (cm)"
              type="text"
              inputProps={{ step: "0.01", min: 0, max: 3, maxLength: 3 }}
              fullWidth
              value={height?.value || ""}
              onChange={updateHeight}
              error={alertHeightRequired}
              helperText={
                alertHeightRequired
                  ? "*Please enter a valid height (0-300cm)"
                  : null
              }
            />
            <FormControl error={alertGenderRequired}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-required"
                value={gender || ""}
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
          </Box>
          {/* Fitness Section */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              mt: 2,
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Fitness
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3,
            }}
          >
            <TextField
              name="bloodGlucose"
              label="Blood Glucose (mmol/L)"
              type="text"
              inputProps={{ step: "0.01", min: 0, max: 20, maxLength: 4 }}
              fullWidth
              onChange={updateBloodGlucose}
              error={alertBloodGlucoseRequired}
              helperText={
                alertBloodGlucoseRequired
                  ? "*Please enter a valid BloodGlucose (0-20mmol/L)"
                  : null
              }
              value={bloodGlucoseInput}
            />
            <TextField
              name="apHigh"
              label="Systolic Blood Pressure (mmHg)"
              type="text"
              inputProps={{ step: "0.1", min: 0, max: 200, maxLength: 5 }}
              fullWidth
              onChange={updateApHigh}
              error={alertApHighRequired}
              helperText={
                alertApHighRequired
                  ? "*Please enter a valid AP High (0-200 mmHg)"
                  : null
              }
            />
            <TextField
              name="apLow"
              label="Diastolic Blood Pressure (mmHg)"
              type="text"
              inputProps={{ step: "0.1", min: 0, max: 200, maxLength: 5 }}
              fullWidth
              onChange={updateApLow}
              error={alertApLowRequired}
              helperText={
                alertApLowRequired
                  ? "*Please enter a valid Diastolic Pressure (0-200 mmHg)"
                  : null
              }
            />
          </Box>
          {/*Multi-select Health Conditions  */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              mt: 2,
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Health Conditions
          </Typography>
          <Box sx={{ mt: 3, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="health-conditions">
                Health Conditions (if any)
              </InputLabel>
              <Select
                labelId="health-conditions-label"
                id="health-conditions-checkbox"
                multiple
                value={condition}
                onChange={handleChangeCondition}
                input={<OutlinedInput label="Health Conditions (if any)" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {healthConditions.map((name) => {
                  const selected = condition.includes(name);
                  const SelectionIcon = selected
                    ? CheckBoxIcon
                    : CheckBoxOutlineBlankIcon;
                  return (
                    <MenuItem key={name} value={name}>
                      <SelectionIcon
                        fontSize="small"
                        style={{
                          marginRight: 8,
                          padding: 9,
                          boxSizing: "content-box",
                        }}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          {/*Multi-select LifeStyle Habits */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              mt: 2,
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Life Style
          </Typography>
          <Box sx={{ mt: 3, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="life-style">
                Life Style Habits (if any)
              </InputLabel>
              <Select
                labelId="life-style-label"
                id="life-style-checkbox"
                multiple
                value={lifeStyle}
                onChange={handleChangeLifeStyle}
                input={<OutlinedInput label="Life Style Habits (if any)" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {lifeStyleChoices.map((name) => {
                  const selected = lifeStyle.includes(name);
                  const SelectionIcon = selected
                    ? CheckBoxIcon
                    : CheckBoxOutlineBlankIcon;

                  return (
                    <MenuItem key={name} value={name}>
                      <SelectionIcon
                        fontSize="small"
                        style={{
                          marginRight: 8,
                          padding: 9,
                          boxSizing: "content-box",
                        }}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {/*Multi-select LifeStyle Habits */}
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                mt: 2,
                color: "primary.main",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Personal Information
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              {/* Marital Status Selection */}
              <FormControl error={alertMaritalStatusRequired}>
                <InputLabel id="marital-status-label">
                  Marital Status
                </InputLabel>
                <Select
                  labelId="marital-status-label"
                  id="marital-status-required"
                  value={maritalStatus}
                  onChange={updateMaritalStatus}
                  label="Marital Status"
                >
                  <MenuItem value={"Single"}>Single</MenuItem>
                  <MenuItem value={"Married"}>Married</MenuItem>
                </Select>
                {alertMaritalStatusRequired && (
                  <FormHelperText>
                    *Please enter your working status
                  </FormHelperText>
                )}
              </FormControl>
              {/* Working Status Selection */}
              <FormControl error={alertWorkingStatusRequired}>
                <InputLabel id="working-status-label">
                  Working Status
                </InputLabel>
                <Select
                  labelId="working-status-label"
                  id="working-status-required"
                  value={workingStatus}
                  label="Working Status"
                  onChange={updateWorkingStatus}
                >
                  <MenuItem value={"Unemployed"}>Unemployed</MenuItem>
                  <MenuItem value={"Private"}>Private</MenuItem>
                  <MenuItem value={"Student"}>Student</MenuItem>
                  <MenuItem value={"Public"}>Public</MenuItem>
                </Select>
                {alertWorkingStatusRequired && (
                  <FormHelperText>
                    *Please enter your working status
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button variant="contained" type="submit" size="large">
              Submit
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GenerateReportForm;
