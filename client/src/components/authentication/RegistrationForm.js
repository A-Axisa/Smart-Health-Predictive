import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Stack, TextField, Button, Typography, Link,
         FormControlLabel, Alert, Dialog, DialogContent, DialogTitle,
         DialogActions, Divider, Radio, 
         RadioGroup} from '@mui/material'
import PasswordInputField from '../authentication/PasswordInputField';
import EmailInputField from '../authentication/EmailInputField';
import PhoneInputField from '../authentication/PhoneInputField';

const FULL_NAME_MAX_LENGTH = 255
const ACCOUNT_TYPES = Object.freeze({
  STANDARD: 'user',
  MERCHANT: 'merchant',
})

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [nameState, setNameState] = useState(null);
  const [emailState, setEmailState] = useState(null);
  const [phoneState, setPhoneState] = useState(null);
  const [passwordState, setPasswordState] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertNameRequired, setAlertNameRequired] = useState(false);
  const [alertEmailRequired, setAlertEmailRequired] = useState(false);
  const [alertPasswordRequired, setAlertPasswordRequired] = useState(false);
  const [alertPasswordsDontMatch, setAlertPasswordsDontMatch] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function updateName(e) {
    const isNameValid = e.target.value !== '';
    setNameState({ 'isValid': isNameValid, 'name':e.target.value });
    setAlertNameRequired(!isNameValid);
  }

  function updateEmail(e) {
    setAlertEmailRequired(false);
    setEmailState(e);
  }

  function updatePassword(e){
    setAlertPasswordRequired(false);
    setPasswordState(e);
    setAlertPasswordsDontMatch(confirmPassword !== e.password ||
      e.password === '');
  }

  function updateConfirmPassword(e) {
    const confirmPasswordInput = e.target.value;
    setConfirmPassword(confirmPasswordInput);
    setAlertPasswordsDontMatch(confirmPasswordInput !== passwordState.password ||
      confirmPasswordInput === '');
  }

  function updateAllInputFieldAlerts() {
    setAlertNameRequired(nameState === null || !nameState.isValid);
    setAlertEmailRequired(emailState === null);
    setAlertPasswordRequired(passwordState === null);
    setAlertPasswordsDontMatch(passwordState === null || 
      confirmPassword !== passwordState.password ||
      confirmPassword === '');
  }

  function isAllInputsValid() {
    return nameState !== null && nameState.isValid &&
      emailState !== null && emailState.isValid &&
      (phoneState === null || phoneState.isValid) &&
      passwordState !== null && passwordState.isValid &&
      passwordState.password === confirmPassword;
  }

  function generateUnsuccessfulCreationAlert() {
    if (showFailMessage){
      return <Alert variant="filled" severity="error"> 
        Account creation unsuccessful.</Alert>
    }
    return null;
  }

  function handleCloseMessage() {
    setShowSuccessMessage(false);
    navigate('/login');
  } 

  async function handleRegistration(e) {
    e.preventDefault();

    // Show error message for empty required fields.
    updateAllInputFieldAlerts();
    if (!isAllInputsValid()) {
      return;
    }

    setIsLoading(true);

  // Post the fetch request with the supplied details.
  await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: nameState.name,
        password: passwordState.password,
        email: emailState.email,
        phone:  phoneState !== null ? phoneState.phone : '',
        account_type: e.target.account_type.value
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
    });
    setIsLoading(false);
  }

  return (
    <Container sx={{ borderRadius:{xs:0, sm:2}, padding:'25px', 
      alignItems:'center',  boxShadow:24, backgroundColor:'#ffffff', 
      width:{xs:'auto', sm:'500px'}, flexGrow:{xs:1, sm:0} }}>

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

      <Container component='form' onSubmit={handleRegistration}>
        <Stack spacing={{xs:2}}>
          {generateUnsuccessfulCreationAlert()}
          <Divider variant='middle' aria-hidden='true' sx={{fontWeight:'bold',
            py:'5px'}}>
            Account Type
          </Divider>
          <Container display='flex' justifyContent='center'>
            <RadioGroup row defaultValue={ACCOUNT_TYPES.STANDARD} 
              name='account_type' align='center' sx={{ gap:5}}>
              <FormControlLabel value={ACCOUNT_TYPES.STANDARD} control={<Radio />}
                label='Standard User' />
              <FormControlLabel value={ACCOUNT_TYPES.MERCHANT} control={<Radio />}
                label='Merchant' />
            </RadioGroup>
          </Container>

          <Divider variant='middle' aria-hidden='true' sx={{fontWeight:'bold', 
            py:'5px'}}>
            Details
          </Divider>
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
            label='Confirm Password' onChange={updateConfirmPassword} 
            type='password' error={alertPasswordsDontMatch} 
            helperText={alertPasswordsDontMatch ? '*Passwords do not match' : null}>
          </TextField>

          <Button loading={isLoading} type='submit' variant='contained' sx={{ 
            py:{xs:'1rem', sm:'.9rem'}, fontSize:{xs:'1.2rem', sm:'1rem'} }}>
            Create Account 
          </Button>
          <Stack direction='row' spacing={{xs:1}} 
            style={{ justifyContent:'center'}}> 
            <Typography noWrap={true}  align='center' style={{ color:'#888888' }}>
              Already have an account?
            </Typography>
            <Link href="/login" align='center' fontWeight='bold' >Log in</Link>
          </Stack>

        </Stack>
      </Container>
    </Container>
  );
}

export default RegistrationForm;
