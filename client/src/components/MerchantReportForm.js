import { Box, TextField, Grid, FormControl, FormLabel,
RadioGroup, FormControlLabel, Radio, Paper, Typography,
Button } from '@mui/material';


function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  console.log({
    // Personal information
    firstName: formData.get('firstName'),
    middleName: formData.get('middleName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),

    // Age & physique
    age: formData.get('age'),
    weight: formData.get('weight'),
    height: formData.get('height'),
    bloodGlucose: formData.get('bloodGlucose'),

    // Fitness
    exercise: formData.get('exercise'),
    heartDisease: formData.get('heartDisease'),
    hyperTension: formData.get('hyperTension'),
    diabetes: formData.get('diabetes'),

    // Lifestyle
    alcohol: formData.get('alcohol'),
    smoker: formData.get('smoker'),

    // Life events
    maritalStatus: formData.get('maritalStatus'),
    workingStatus: formData.get('workingStatus')
  });
}

const MerchantReportForm = ({}) => {
  return (
    <Paper elevation={3}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p:1 }}>
        <Grid container spacing={2}>
          <Grid item size={12} sx={{justifyContent: 'center', display: 'flex'}}>
            <Typography variant='h5' color='primary' sx={{fontWeight: '600'}}>
              Health Report
            </Typography>
          </Grid>
          
            {/* Personal information */}
            <Grid item size={12}>
              <Typography variant='h6' color='primary' sx={{fontWeight: '600'}}>
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField required fullWidth name='firstName' label='First Name' placeholder='John'/>
            </Grid>
            <Grid item xs={8}>
              <TextField required fullWidth name='middleName' label='Middle Name' placeholder='Doe'/>
            </Grid>
            <Grid item xs={4}>
              <TextField required fullWidth name='lastName' label='Last Name' placeholder='Smith'/>
            </Grid>
            <Grid item xs={12}>
              <TextField required name='email' label='Email' placeholder='firstname@example.com'/>
            </Grid>

            {/* Age & physique */}
            <Grid item size={12}>
              <Typography variant='h6' color='primary' sx={{fontWeight: '600'}}>Age & Physique</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField required name='weight' label='Weight (kg)'/>
            </Grid>
            <Grid item xs={6}>
              <TextField required name='age' label='Age'/>
            </Grid>
            <Grid item xs={6}>
              <TextField required name='height' label='Height (cm)'/>
            </Grid>
            <Grid item xs={6}>
              <TextField required name='bloodGlucose' label='Blood Glucose (mmol/L)'/>
            </Grid>

            {/* Fitness */}
            <Grid item size={12}>
              <Typography variant='h6' color='primary' sx={{fontWeight: '600'}}>
                Fitness
              </Typography>            
            </Grid>
            {/* Exercise */}
            <Grid>
              <FormControl>
                <FormLabel id="exercise">Exercise</FormLabel>
                <RadioGroup row aria-labelledby="exercise" name="exercise">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Heart disease */}
            <Grid>
              <FormControl>
                <FormLabel id="heartDisease">Heart Disease</FormLabel>
                <RadioGroup row aria-labelledby="heartDisease" name="heartDisease">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Hyper tension */}
            <Grid>
              <FormControl>
                <FormLabel id="hyperTension">Hypter Tension</FormLabel>
                <RadioGroup row aria-labelledby="hyperTension" name="hyperTension">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Diabetes */}
            <Grid>
              <FormControl>
                <FormLabel id="diabetes">Diabetes</FormLabel>
                <RadioGroup row aria-labelledby="diabetes" name="diabetes">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Lifestyle */}
            <Grid item size={12}>
              <Typography variant='h6' color='primary' sx={{fontWeight: '600'}}>
                Life Style
              </Typography>
            </Grid>
            {/* Alcohol */}
            <Grid>
              <FormControl>
                <FormLabel id="alcohol">Alcohol</FormLabel>
                <RadioGroup row aria-labelledby="alcohol" name="alcohol">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Smoker */}
            <Grid>
              <FormControl>
                <FormLabel id="smoker">Smoker</FormLabel>
                <RadioGroup row aria-labelledby="smoker" name="smoker">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Life events */}
            <Grid item size={12}>
              <Typography variant='h6' color='primary' sx={{fontWeight: '600'}}>
                Life Events
              </Typography>
            </Grid>
            {/* Marital Status */}
            <Grid>
              <FormControl>
                <FormLabel id="maritalStatus">Marital Status</FormLabel>
                <RadioGroup row aria-labelledby="maritalStatus" name="maritalStatus">
                  <FormControlLabel value="married" control={<Radio />} label="Married" />
                  <FormControlLabel value="single" control={<Radio />} label="Single" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Working Status */}
            <Grid>
              <FormControl>
                <FormLabel id="workingStatus">Working Status</FormLabel>
                <RadioGroup row aria-labelledby="workingStatus" name="workingStatus">
                  <FormControlLabel value="private" control={<Radio />} label="Private" />
                  <FormControlLabel value="public" control={<Radio />} label="Public" />
                  <FormControlLabel value="student" control={<Radio />} label="Student" />
                  <FormControlLabel value="unemployed" control={<Radio />} label="Unemployed" />
                </RadioGroup>
              </FormControl>
            </Grid>
        </Grid>
      </Box>
      <Button href='/ai-health-prediction' variant="contained" fullWidth sx={{}}>
        Submit
      </Button>
    </Paper>
  )
}

export default MerchantReportForm
