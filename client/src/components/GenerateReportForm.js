import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from "@mui/material";
import AppThemeProvider from '../components/AppThemeProvider';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const GenerateReportForm = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState(null)
  const [alertWeightRequired, setAlertWeightRequired] = useState(false)
  const [age, setAge] = useState(null)
  const [alertAgeRequired, setAlertAgeRequired] = useState(false)
  const [height, setHeight] = useState(null)
  const [alertHeightRequired, setAlertHeightRequired] = useState(false)
  const [gender, setGender] = useState(null)
  const [alertGenderRequired, setAlertGenderRequired] = useState(false)
  const [bloodGlucose, setBloodGlucose] = useState(null);
  const [alertBloodGlucoseRequired, setAlertBloodGlucoseRequired] = useState(false);
  const [apLow, setApLow] = useState(null);
  const [alertApLowRequired, setAlertApLowRequired] = useState(false);
  const [apHigh, setApHigh] = useState(null);
  const [alertApHighRequired, setAlertApHighRequired] = useState(false);
  const [hyperTension, setHyperTension] = useState(null);
  const [alertHyperTensionRequired, setAlertHyperTensionRequired] = useState(false);
  const [heartDisease, setHeartDisease] = useState(null);
  const [alertHeartDiseaseRequired, setAlertHeartDiseaseRequired] = useState(false);
  const [diabetes, setDiabetes] = useState(null);
  const [alertDiabetesRequired, setAlertDiabetesRequired] = useState(false);
  const [highCholesterol, setHighCholesterol] = useState(null);
  const [alertHighCholesterolRequired, setAlertHighCholesterolRequired] = useState(false);
  const [alcohol, setAlcohol] = useState(null);
  const [alertAlcoholRequired, setAlertAlcoholRequired] = useState(false);
  const [smoker, setSmoker] = useState(null);
  const [alertSmokerRequired, setAlertSmokerRequired] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [alertMaritalStatusRequired, setAlertMaritalStatusRequired] = useState(false);
  const [workingStatus, setWorkingStatus] = useState(null);
  const [alertWorkingStatusRequired, setAlertWorkingStatusRequired] = useState(false);

  function updateAge(e) {
    const ageValue = Number(e.target.value);
    const isAgeValid = Number.isInteger(ageValue) && ageValue !== "" && ageValue >= 0 && ageValue <= 100;
    setAge({ isValid: isAgeValid, value: ageValue });
    setAlertAgeRequired(!isAgeValid);
  }

  function updateWeight(e) {
    const weightValue = e.target.value;
    const isWeightValid = weightValue !== "" && weightValue >= 0 && weightValue <= 200;
    setWeight({ isValid: isWeightValid, value: weightValue });
    setAlertWeightRequired(!isWeightValid);
  }

  function updateHeight(e) {
    const heightValue = e.target.value;
    const isHeightValid = heightValue !== "" && heightValue >= 0 && heightValue <= 300;
    setHeight({ isValid: isHeightValid, value: heightValue });
    setAlertHeightRequired(!isHeightValid);
  }

  function updateGender(e) {
    setGender(e.target.value);
    setAlertGenderRequired(false);
  }

  function updateBloodGlucose(e) {
    const bloodGlucoseValue = e.target.value;
    const isBloodGlucoseValid = bloodGlucoseValue !== "" && bloodGlucoseValue >= 0 && bloodGlucoseValue <= 20;
    setBloodGlucose({ isValid: isBloodGlucoseValid, value: bloodGlucoseValue });
    setAlertBloodGlucoseRequired(!isBloodGlucoseValid);
  }

  function updateApLow(e) {
    const apLowValue = e.target.value;
    const isApLowValid = apLowValue !== "" && apLowValue >= 0 && apLowValue <= 200;
    setApLow({ isValid: isApLowValid, value: apLowValue });
    setAlertApLowRequired(!isApLowValid);
  }

  function updateApHigh(e) {
    const apHighValue = e.target.value;
    const isApHighValid = apHighValue !== "" && apHighValue >= 0 && apHighValue <= 200;
    setApHigh({ isValid: isApHighValid, value: apHighValue });
    setAlertApHighRequired(!isApHighValid);
  }
  function updateHyperTension(e) {
    setHyperTension(e.target.value);
    setAlertHyperTensionRequired(false);
  }
  function updateHeartDisease(e) {
    setHeartDisease(e.target.value);
    setAlertHeartDiseaseRequired(false);
  }
  function updateDiabetes(e) {
    setDiabetes(e.target.value);
    setAlertDiabetesRequired(false);
  }
  function updateHighCholesterol(e) {
    setHighCholesterol(e.target.value);
    setAlertHighCholesterolRequired(false);
  }
  function updateAlcohol(e) {
    setAlcohol(e.target.value);
    setAlertAlcoholRequired(false);
  }
  function updateSmoker(e) {
    setSmoker(e.target.value);
    setAlertSmokerRequired(false);
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
    return weight !== null && weight.isValid &&
      age !== null && age.isValid &&
      height !== null && height.isValid &&
      gender !== null &&
      bloodGlucose !== null && bloodGlucose.isValid &&
      apLow !== null && apLow.isValid &&
      apHigh !== null && apHigh.isValid &&
      hyperTension !== null &&
      heartDisease !== null &&
      diabetes !== null &&
      highCholesterol !== null &&
      alcohol !== null &&
      smoker !== null &&
      maritalStatus !== null &&
      workingStatus !== null;
  }
  function updateAllInputFieldAlerts() {
    setAlertWeightRequired(weight === null || !weight.isValid);
    setAlertAgeRequired(age === null || !age.isValid);
    setAlertHeightRequired(height === null || !height.isValid);
    setAlertGenderRequired(gender === null);
    setAlertBloodGlucoseRequired(bloodGlucose === null || !bloodGlucose.isValid);
    setAlertApLowRequired(apLow === null || !apLow.isValid);
    setAlertApHighRequired(apHigh === null || !apHigh.isValid);
    setAlertHyperTensionRequired(hyperTension === null);
    setAlertHeartDiseaseRequired(heartDisease === null);
    setAlertDiabetesRequired(diabetes === null);
    setAlertHighCholesterolRequired(highCholesterol === null);
    setAlertAlcoholRequired(alcohol === null);
    setAlertSmokerRequired(smoker === null);
    setAlertMaritalStatusRequired(maritalStatus === null);
    setAlertWorkingStatusRequired(workingStatus === null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    updateAllInputFieldAlerts();
    if (!isAllInputsValid()) {
      return;
    }


  // Fetch request for AI Model
  await fetch(`${API_BASE}/healthPrediction`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        age: e.target.age.value,
        weight: e.target.weight.value,
        height: e.target.height.value,
        gender: e.target.gender.value,
        bloodGlucose: e.target.bloodGlucose.value,
        ap_hi: e.target.apHigh.value,
        ap_lo: e.target.apLow.value,
        highCholesterol: e.target.highCholesterol.value,
        hyperTension: e.target.hyperTension.value,
        heartDisease: e.target.heartDisease.value,
        diabetes: e.target.diabetes.value,
        alcohol: e.target.alcohol.value,
        smoker: e.target.smoker.value,
        maritalStatus: e.target.maritalStatus.value,
        workingStatus: e.target.workingStatus.value,
        merchantID: null
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    }).then(data => {
      navigate('/ai-health-prediction') // Route the user to the Health prediction page after submission
    }).catch(error => {
      console.log(error)
    })


  }
  return (
    <Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2, boxShadow: 24  }}>
        <CardHeader title="Generate Report" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>

            {/* Age & Physique Section */}
            <Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
              Age & Physique
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, }}>
              <TextField name="weight" label="Weight (Kg)" type="text" inputProps={{ step: "0.01", min: 0, max: 200, maxLength: 5 }} onChange={updateWeight}
                error={alertWeightRequired} helperText={alertWeightRequired ? '*Please enter a valid weight (0-200kg)' : null} />

              <TextField name="age" label="Age" type="text" inputProps={{ min: 0, max: 100, maxLength: 3 }} fullWidth onChange={updateAge}
                error={alertAgeRequired} helperText={alertAgeRequired ? '*Please enter a valid age (0-100)' : null} />

              <TextField name="height" label="Height (cm)" type="text" inputProps={{ step: "0.01", min: 0, max: 3, maxLength: 3 }} fullWidth onChange={updateHeight}
                error={alertHeightRequired} helperText={alertHeightRequired ? '*Please enter a valid height (0-300cm)' : null} />

              <FormLabel>Gender
                <RadioGroup row name="gender" onChange={updateGender}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                </RadioGroup>

                {alertGenderRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>
            </Box>
            {/* Fitness Section */}
            <Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
              Fitness
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, }}>
              <TextField name="bloodGlucose" label="Blood Glucose" type="text" inputProps={{ step: "0.01", min: 0, max: 20, maxLength: 4 }} fullWidth
                onChange={updateBloodGlucose}
                error={alertBloodGlucoseRequired} helperText={alertBloodGlucoseRequired ? '*Please enter a valid BloodGlucose (0-20mmol/L)' : null} />
              <TextField name="apHigh" label="Systolic Blood Pressure" type="text" inputProps={{ step: "0.1", min: 0, max: 200, maxLength: 5 }} fullWidth
                onChange={updateApHigh}
                error={alertApHighRequired} helperText={alertApHighRequired ? '*Please enter a valid AP High (0-200 mmHg)' : null} />


              <TextField name="apLow" label="Diastolic Blood Pressure" type="text" inputProps={{ step: "0.1", min: 0, max: 200, maxLength: 5 }} fullWidth
                onChange={updateApLow}
                error={alertApLowRequired} helperText={alertApLowRequired ? '*Please enter a valid Diastolic Pressure (0-200 mmHg)' : null} />

            

              {/* Fitness Section */}
              <FormLabel>Hyper Tension
                <RadioGroup row name="hyperTension" onChange={updateHyperTension}>
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                </RadioGroup>
                {alertHyperTensionRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              <FormLabel>Heart Disease
                <RadioGroup row name="heartDisease" onChange={updateHeartDisease}>
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                </RadioGroup>
                {alertHeartDiseaseRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              <FormLabel>Diabetes
                <RadioGroup row name="diabetes" onChange={updateDiabetes}>
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                </RadioGroup>
                {alertDiabetesRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              <FormLabel>High Cholesterol
                <RadioGroup row name="highCholesterol" onChange={updateHighCholesterol}>
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                </RadioGroup>
                {alertHighCholesterolRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              {/* Lifestyle Section */}
              <FormLabel>Alcohol
                <RadioGroup row name="alcohol" onChange={updateAlcohol}>
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                </RadioGroup>
                {alertAlcoholRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              <FormLabel>Smoker
                <RadioGroup row name="smoker" onChange={updateSmoker}>
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                  <FormControlLabel value="Former smoker" control={<Radio />} label="Former Smoker" />
                </RadioGroup>
                {alertSmokerRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              {/* Life Events Section */}
              <FormLabel>Marital Status
                <RadioGroup row name="maritalStatus" onChange={updateMaritalStatus}>
                  <FormControlLabel value="Married" control={<Radio />} label="Married" />
                  <FormControlLabel value="Single" control={<Radio />} label="Single" />
                </RadioGroup>
                {alertMaritalStatusRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              <FormLabel>Working Status
                <RadioGroup row name="workingStatus" onChange={updateWorkingStatus}>
                  <FormControlLabel value="Unemployed" control={<Radio />} label="Unemployed" />
                  <FormControlLabel value="Student" control={<Radio />} label="Student" />
                  <FormControlLabel value="Private" control={<Radio />} label="Private" />
                  <FormControlLabel value="Public" control={<Radio />} label="Public" />
                  
                </RadioGroup>
                {alertWorkingStatusRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" type="submit" size="large">Submit</Button>
          </Box>
        </Box>
        </CardContent>
      </Card>
  );
}

export default GenerateReportForm