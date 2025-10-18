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

const GenerateReportForm = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState(null)
  const [alertWeightRequired, setAlertWeightRequired] = useState(false)
  const [age, setAge] = useState(null)
  const [alertAgeRequired, setAlertAgeRequired] = useState(false)
  const [height, setHeight] = useState(null)
  const [alertHeightRequired, setAlertHeightRequired] = useState(false)
  const [bloodGlucose, setBloodGlucose] = useState(null);
  const [alertBloodGlucoseRequired, setAlertBloodGlucoseRequired] = useState(false);
  const [apLow, setApLow] = useState(null);
  const [alertApLowRequired, setAlertApLowRequired] = useState(false);
  const [apHigh, setApHigh] = useState(null);
  const [alertApHighRequired, setAlertApHighRequired] = useState(false);
  const [exercise, setExercise] = useState(null);
  const [alertExerciseRequired, setAlertExerciseRequired] = useState(false);
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
    const ageValue = e.target.value;
    const isAgeValid = ageValue !== "" && ageValue >= 0 && ageValue <= 100;
    setAge({ isValid: isAgeValid, value: ageValue });
    setAlertAgeRequired(!isAgeValid);
  }

  function updateWeight(e) {
    const weightValue = e.target.value;
    const isWeightValid = weightValue !== "" && weightValue >= 0 && weightValue <= 300;
    setWeight({ isValid: isWeightValid, value: weightValue });
    setAlertWeightRequired(!isWeightValid);
  }

  function updateHeight(e) {
    const heightValue = e.target.value;
    const isHeightValid = heightValue !== "" && heightValue >= 0 && heightValue <= 3;
    setHeight({ isValid: isHeightValid, value: heightValue });
    setAlertHeightRequired(!isHeightValid);
  }

  function updateBloodGlucose(e) {
    const bloodGlucoseValue = e.target.value;
    const isBloodGlucoseValid = bloodGlucoseValue !== "" && bloodGlucoseValue >= 0 && bloodGlucoseValue <= 33;
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

  function updateExercise(e) {
    setExercise(e.target.value);
    setAlertExerciseRequired(false);
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
      bloodGlucose !== null && bloodGlucose.isValid &&
      apLow !== null && apLow.isValid &&
      apHigh !== null && apHigh.isValid &&
      exercise !== null &&
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
    setAlertBloodGlucoseRequired(bloodGlucose === null || !bloodGlucose.isValid);
    setAlertApLowRequired(apLow === null || !apLow.isValid);
    setAlertApHighRequired(apHigh === null || !apHigh.isValid);
    setAlertExerciseRequired(exercise === null);
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
    await fetch('http://localhost:8000/AIPrediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 68849883, //TODO Retreive user ID for logged in user
        age: e.target.age.value,
        weight: e.target.weight.value,
        height: e.target.height.value,
        gender: 1,
        bloodGlucose: e.target.bloodGlucose.value,
        ap_hi: e.target.apHigh.value,
        ap_lo: e.target.apLow.value,
        highCholesterol: e.target.highCholesterol.value,
        exercise: e.target.exercise.value,
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
    <AppThemeProvider>
      <Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2 }}>
        <CardHeader title="Generate Report" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>

            {/* Age & Physique Section */}
            <Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
              Age & Physique
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, }}>
              <TextField name="weight" label="Weight (Kg)" type="number" inputProps={{ step: "0.01", min: 0, max: 300, maxLength: 3 }} onChange={updateWeight}
                error={alertWeightRequired} helperText={alertWeightRequired ? '*Please enter a valid weight (0-300kg)' : null} />

              <TextField name="age" label="Age" type="number" inputProps={{ min: 0, max: 100, maxLength: 3 }} fullWidth onChange={updateAge}
                error={alertAgeRequired} helperText={alertAgeRequired ? '*Please enter a valid age (0-100)' : null} />

              <TextField name="height" label="Height (m)" type="number" inputProps={{ step: "0.01", min: 0, max: 3 }} fullWidth onChange={updateHeight}
                error={alertHeightRequired} helperText={alertHeightRequired ? '*Please enter a valid height (0-3m)' : null} />
            </Box>
            {/* Fitness Section */}
            <Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
              Fitness
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, }}>
              <TextField name="bloodGlucose" label="Blood Glucose" type="number" inputProps={{ step: "0.01", min: 0, max: 20 }} fullWidth
                onChange={updateBloodGlucose}
                error={alertBloodGlucoseRequired} helperText={alertBloodGlucoseRequired ? '*Please enter a valid BloodGlucose (0-20mmol/L)' : null} />

              <TextField name="apLow" label="AP Low" type="number" inputProps={{ step: "0.1", min: 0, max: 200 }} fullWidth
                onChange={updateApLow}
                error={alertApLowRequired} helperText={alertApLowRequired ? '*Please enter a valid AP Low (0-200 mmHg)' : null} />

              <TextField name="apHigh" label="AP High" type="number" inputProps={{ step: "0.1", min: 0, max: 200 }} fullWidth
                onChange={updateApHigh}
                error={alertApHighRequired} helperText={alertApHighRequired ? '*Please enter a valid AP High (0-200 mmHg)' : null} />

              {/* Fitness Section */}
              <FormLabel>Exercise
                <RadioGroup row name="exercise" onChange={updateExercise}>
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                </RadioGroup>
                {alertExerciseRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

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
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
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
                  <FormControlLabel value="1" control={<Radio />} label="Married" />
                  <FormControlLabel value="0" control={<Radio />} label="Single" />
                </RadioGroup>
                {alertMaritalStatusRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>

              <FormLabel>Working Status
                <RadioGroup row name="workingStatus" onChange={updateWorkingStatus}>
                  <FormControlLabel value="1" control={<Radio />} label="Private/Public" />
                  <FormControlLabel value="0" control={<Radio />} label="Student/Unemployed" />
                </RadioGroup>
                {alertWorkingStatusRequired && (
                  <Typography color="error" variant="caption">
                    *Please select an option
                  </Typography>
                )}
              </FormLabel>


            </Box>
            <Button variant="contained" type="submit" size="large">Submit</Button>
          </Box>

        </CardContent>
      </Card>
    </AppThemeProvider>
  );
}

export default GenerateReportForm