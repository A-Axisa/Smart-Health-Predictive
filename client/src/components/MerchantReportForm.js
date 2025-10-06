import { Box, TextField, Grid, FormControl, FormLabel,
RadioGroup, FormControlLabel, Radio, Paper, Typography,
Button } from '@mui/material';


const MerchantReportForm = ({}) => {
  return (
    <Paper elevation={3}>
      <Box sx={{ p:1 }}>
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
              <TextField required fullWidth name='first-name' label='First Name' placeholder='John'/>
            </Grid>
            <Grid item xs={8}>
              <TextField required fullWidth name='middle-name' label='Middle Name' placeholder='Doe'/>
            </Grid>
            <Grid item xs={4}>
              <TextField required fullWidth name='last-name' label='Last Name' placeholder='Smith'/>
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
              <TextField required name='bloodglucose' label='Blood Glucose (mmol/L)'/>
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
                <RadioGroup row aria-labelledby="exercise" name="exercise-buttons">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Heart disease */}
            <Grid>
              <FormControl>
                <FormLabel id="heart-disease">Heart Disease</FormLabel>
                <RadioGroup row aria-labelledby="heart-disease" name="heart-disease-buttons">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Hyper tension */}
            <Grid>
              <FormControl>
                <FormLabel id="hyper-tension">Hypter Tension</FormLabel>
                <RadioGroup row aria-labelledby="hyper-tension" name="hyper-tension-buttons">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Diabetes */}
            <Grid>
              <FormControl>
                <FormLabel id="diabetes">Diabetes</FormLabel>
                <RadioGroup row aria-labelledby="diabetes" name="diabetes-buttons">
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
                <RadioGroup row aria-labelledby="alcohol" name="alcohol-buttons">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Smoker */}
            <Grid>
              <FormControl>
                <FormLabel id="smoker">Smoker</FormLabel>
                <RadioGroup row aria-labelledby="smoker" name="smoker-buttons">
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
                <FormLabel id="marital-status">Marital Status</FormLabel>
                <RadioGroup row aria-labelledby="marital-status" name="marital-status-buttons">
                  <FormControlLabel value="married" control={<Radio />} label="Married" />
                  <FormControlLabel value="single" control={<Radio />} label="Single" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Working Status */}
            <Grid>
              <FormControl>
                <FormLabel id="working-status">Working Status</FormLabel>
                <RadioGroup row aria-labelledby="working-status" name="working-status-buttons">
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
