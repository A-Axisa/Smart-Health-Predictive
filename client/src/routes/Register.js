import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, TextField, Button, Typography, Link,
  FormControlLabel, Checkbox, Alert, Dialog, DialogContent, DialogTitle,
  DialogActions } from '@mui/material'
import PasswordInputField from '../components/authentication/PasswordInputField';
import EmailInputField from '../components/authentication/EmailInputField';
import PhoneInputField from '../components/authentication/PhoneInputField';
import { useState } from 'react'

const FULL_NAME_MAX_LENGTH = 255

const ACCOUNT_TYPES = Object.freeze({
  STANDARD: 'user',
  MERCHANT: 'merchant',
})

const Register = ({}) => {
  const navigate = useNavigate();
  const [nameState, setNameState] = useState(null)
  const [emailState, setEmailState] = useState(null)
  const [phoneState, setPhoneState] = useState(null)
  const [passwordState, setPasswordState] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [alertNameRequired, setAlertNameRequired] = useState(false)
  const [alertEmailRequired, setAlertEmailRequired] = useState(false)
  const [alertPasswordRequired, setAlertPasswordRequired] = useState(false)
  const [alertPasswordsDontMatch, setAlertPasswordsDontMatch] = useState(false)
  const [showFailMessage, setShowFailMessage] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  function updateName(e) {
    const isNameValid = e.target.value !== '';
    setNameState({ 'isValid': isNameValid, 'name':e.target.value });
    setAlertNameRequired(!isNameValid);
  }

  function updateEmail(e) {
    setAlertEmailRequired(false);
    setEmailState(e)
  }

  function updatePassword(e){
    setAlertPasswordRequired(false);
    setPasswordState(e)
    setAlertPasswordsDontMatch(confirmPassword != e.password ||
      e.password == '')
  }

  function updateConfirmPassword(e) {
    const confirmPasswordInput = e.target.value;
    setConfirmPassword(confirmPasswordInput)
    setAlertPasswordsDontMatch(confirmPasswordInput != passwordState.password ||
      confirmPasswordInput == '')
  }

  function updateAllInputFieldAlerts() {
    setAlertNameRequired(nameState === null || !nameState.isValid)
    setAlertEmailRequired(emailState === null)
    setAlertPasswordRequired(passwordState === null)
    setAlertPasswordsDontMatch(passwordState === null || 
      confirmPassword != passwordState.password ||
      confirmPassword == '')
  }

  function isAllInputsValid() {
    return nameState !== null && nameState.isValid &&
      emailState !== null && emailState.isValid &&
      (phoneState === null || phoneState.isValid) &&
      passwordState !== null && passwordState.isValid &&
      passwordState.password == confirmPassword
  }

  function generateUnsuccessfulCreationAlert() {
    if (showFailMessage){
      return <Alert variant="filled" severity="error"> Account creation unsuccessful.</Alert>
    }
    return null;
  }

  async function handleRegistration(e) {
    e.preventDefault();

    updateAllInputFieldAlerts();
    if (!isAllInputsValid()) {
      return;
    }

    const new_account_type = e.target.is_merchant_account.checked ? 
      ACCOUNT_TYPES.MERCHANT : ACCOUNT_TYPES.STANDARD;
    const phoneNumber = phoneState !== null ? phoneState.phone : '';

    await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: nameState.name,
        password: passwordState.password,
        email: emailState.email,
        phone: phoneNumber,
        account_type: new_account_type
      })
    }).then(response => {
      if (!response.ok) {
        setShowFailMessage(true);
      }
      return response.json()
    }).then(data => {
      setShowSuccessMessage(true)
      setShowFailMessage(false);
    }).catch(error => {
      console.log(error)
    })
  }

  function handleCloseMessage() {
    setShowSuccessMessage(false)
    navigate('/login')
  } 

  return (
    <Box sx={{ backgroundColor:'#127067',  width:'100vw', height:'100vh', 
        padding:'0', margin:'0'}}>

      <Dialog open={showSuccessMessage}>
          <DialogTitle>{'Account Creation Successful!'}</DialogTitle>
          <DialogContent>
            <Typography>
              A verification email has been sent to your inbox. 
              Please check your email to complete the registration process.
            </Typography>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseMessage} autoFocus>Back to login</Button>
          </DialogActions>
      </Dialog>

      <Box sx={{backgroundImage:'linear-gradient(to top left, #133a37ff, #127067)',
          width:'100%', height:'100%', flex:'inline', float:'left', display:'flex',
          alignItems:'center'}}>
        <Container sx={{ backgroundColor:'#ffffff', width:'30%', borderRadius:2, 
            padding:'25px', alignItems:'center', boxShadow:24}}>
          <Box component='form' onSubmit={handleRegistration}>
            <Stack spacing={{xs:2}}>
              <h1>Create Account</h1>
              {generateUnsuccessfulCreationAlert()}
              <TextField id='outlined-input' name='full_name' label='Full Name' 
                onChange={updateName} 
                slotProps={{ htmlInput: {maxLength:FULL_NAME_MAX_LENGTH},}}
                error={alertNameRequired} helperText={alertNameRequired ? '*Required':null}>
              </TextField>
              <PhoneInputField onChange={setPhoneState} />
              <EmailInputField onChange={updateEmail} showRequired={alertEmailRequired} />
              <PasswordInputField onChange={updatePassword} truncate={true} 
                showRequired={alertPasswordRequired}/>
              <TextField id='outlined-password-input' name='confirmPassword'
                label='Confirm Password' onChange={updateConfirmPassword} type='password'
                error={alertPasswordsDontMatch} 
                helperText={alertPasswordsDontMatch ? '*Passwords do not match' : null}>
              </TextField>
              <FormControlLabel control={<Checkbox name='is_merchant_account' />} 
                label='Merchant Account' />
              <Button type='submit' variant="contained">Create</Button>
              <Stack direction='row' spacing={{xs:1}} 
                  style={{ justifyContent:"center"}}> 
                <Typography align='center' style={{ color:'#888888' }}>Already 
                    have an account?</Typography>
                <Link href="/login" align='center' fontWeight='bold' >Log in</Link>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
      
    </Box>
  )
}

export default Register
