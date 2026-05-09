import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FormHelperText from "@mui/material/FormHelperText";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { styled } from "@mui/material/styles";

import BloodReportUpload from "./BloodReportUpload";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const MerchantReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageData = location.state;
  const defaultSelectedPatient =
    pageData && pageData["patientID"] ? pageData["patientID"] : null;
  const [patientName, setPatientName] = useState(null);

  // Patient data for Merchant to select
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(
    defaultSelectedPatient,
  );
  // List health conditions
  const healthConditions = [
    "Hyper Tension",
    "Heart Disease",
    "Diabetes",
    "High Cholesterol",
    "Stroke",
  ];
  // List of lifestyle choices
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
  // List variables from multiselect lists
  const [condition, setCondition] = useState([]);
  const [lifeStyle, setLifeStyle] = useState([]);

  // Form Variables and alerts for input validation
  const [weight, setWeight] = useState(null);
  const [alertWeightRequired, setAlertWeightRequired] = useState(false);
  const [age, setAge] = useState(null);
  const [alertAgeRequired, setAlertAgeRequired] = useState(false);
  const [height, setHeight] = useState(null);
  const [alertHeightRequired, setAlertHeightRequired] = useState(false);
  const [gender, setGender] = useState(null);
  const [alertGenderRequired, setAlertGenderRequired] = useState(false);
  const [bloodGlucose, setBloodGlucose] = useState("");
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
  const [alertPatientRequired, setAlertPatientRequired] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Retrieve Patient names
  useEffect(() => {
    fetch(`${API_BASE}/merchants/patient-names`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPatientList(data);
        if (defaultSelectedPatient) {
          const name = data.find(
            (item) => item.patientId == defaultSelectedPatient,
          );
          setPatientName(name.name);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  function handleChangeCondition(e) {
    const {
      target: { value },
    } = e;
    setCondition(typeof value === "string" ? value.split(",") : value);
  }

  useEffect(() => {
    async function fetchPatientData() {
      if (!selectedPatient) return;

      try {
        const response = await fetch(
          `${API_BASE}/merchant/patient-data/${selectedPatient}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!response.ok) {
          throw new Error(response.status);
        }
        const data = await response.json();

        setWeight({ isValid: true, value: data.weight });
        setHeight({ isValid: true, value: data.height });
        setGender(data.gender);
        setAge({ isValid: true, value: data.age });
      } catch (err) {
        console.log("Failed to fetch patient data.");
      }
    }
    fetchPatientData();
  }, [selectedPatient]);

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
  function updatePatient(e, name) {
    setSelectedPatient(e.target.value);
    setAlertPatientRequired(false);
    if (name) {
      setPatientName(name);
    }
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
      workingStatus !== null &&
      selectedPatient !== null
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
    setAlertPatientRequired(selectedPatient === null);
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

  // Handles uploading CSV files for bulk upload
  const handleReportUpload = async (e) => {
    // Retrieve the selcted file from upload
    const file = e.target.files[0];

    // Add file to FormData object for request
    const formData = new FormData();
    formData.append("uploaded_file", file);

    setIsLoading(true);

    // Sends the file to the upload endpoint for parsing
    await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
    navigate("/merchant-reports");
    setIsLoading(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    updateAllInputFieldAlerts();
    if (!isAllInputsValid()) {
      setIsLoading(false);
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
    await fetch(`${API_BASE}/merchant-health-prediction`, {
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
        bloodGlucose: bloodGlucose.value,
        apHi: apHigh.value,
        apLo: apLow.value,
        highCholesterol: highCholesterol,
        hypertension: hyperTension,
        heartDisease: heartDisease,
        diabetes: diabetes,
        alcohol: alcohol,
        smoker: smoker,
        maritalStatus: maritalStatus,
        workingStatus: workingStatus,
        stroke: stroke,
        patientId: selectedPatient,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        navigate("/merchant-reports", {
          state: { patientName: patientName },
        }); // Route the user to the Health prediction page after submission
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const HiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  return (
    <Card
      variant="outlined"
      sx={{
        margin: "1rem auto",
        padding: 2,
        boxShadow: 24,
        width: {
          xs: "100%",
          sm: "90%",
          md: "75%",
        },
        maxWidth: "1100px",
        alignContent: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 2,
          mt: 2,
          textAlign: "center",
        }}
      >
        Generate Report
      </Typography>
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
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: 3,
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Upload a CSV file to bulk upload multiple patient reports.
          </Typography>
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            size="large"
            startIcon={<FileUploadIcon />}
            loading={isLoading}
          >
            Upload File
            <HiddenInput
              type="file"
              accept=".csv"
              onChange={handleReportUpload}
            />
          </Button>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Patient List */}
          <Box sx={{ p: 2 }}>
            <Autocomplete
              fullWidth
              options={patientList}
              value={patientList.find((p) => p.patientId === selectedPatient)}
              onChange={(event, newValue) => {
                updatePatient(
                  { target: { value: newValue ? newValue.patientId : "" } },
                  newValue.name,
                );
              }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient"
                  error={alertPatientRequired}
                  helperText={
                    alertPatientRequired ? "*Please enter a patient" : ""
                  }
                />
              )}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  mb: 3,
                  color: "text.secondary",
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Upload a blood report to automatically pre-fill some of the
                patient's health data, or enter the details manually below to
                generate your health report.
              </Typography>
              <BloodReportUpload onChange={readBloodReport} />
            </Box>
          </Box>
          {/* Age & Physique Section */}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              mt: 2,
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
            variant="h4"
            sx={{
              mb: 2,
              mt: 2,
            }}
          >
            Health & Fitness
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/*Multi-select Health Conditions  */}
            <FormControl>
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
              value={bloodGlucose.value}
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

          {/*Multi-select LifeStyle Habits */}

          <Typography
            variant="h4"
            sx={{
              mb: 2,
              mt: 2,
            }}
          >
            Life Style
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
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

            {/* Marital Status Selection */}
            <FormControl error={alertMaritalStatusRequired}>
              <InputLabel id="marital-status-label">Marital Status</InputLabel>
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
              <InputLabel id="working-status-label">Working Status</InputLabel>
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

          <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
            <Button
              loading={isLoading}
              variant="contained"
              type="submit"
              size="large"
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MerchantReportForm;
