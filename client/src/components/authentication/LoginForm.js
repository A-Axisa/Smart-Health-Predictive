import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { Box, Container, Stack, Button, Typography, Link, 
         Alert, Divider } from '@mui/material'
import PasswordInputField from '../authentication/PasswordInputField';
import EmailInputField from '../authentication/EmailInputField';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Provides the user a form with the required fields and buttons to login to
 * the application.
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoginUnsuccessful, setIsLoginUnsuccessful] = useState(false);
  const [password, setPassword] = useState(null)
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [alertPasswordRequired, setAlertPasswordRequired] = useState(false)
  const [email, setEmail] = useState(null)
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [alertEmailRequired, setAlertEmailRequired] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function validateEmail(e) {
    setAlertEmailRequired(false);
    setIsEmailValid(e.isValid);
    setEmail(e.email.trim());
  }

  function validatePassword(e) {
    setAlertPasswordRequired(false);
    setIsPasswordValid(e.isValid);
    setPassword(e.password);
  }

  function generateUnsuccessfulLoginAlert() {
    if (isLoginUnsuccessful){
      return <Alert variant="filled" severity="error"> Login details are 
        incorrect</Alert>
    }
    return null;
  }

  async function handleLogin(e) {
    e.preventDefault();

    // Check if all input fields are valid.
    if(!isEmailValid) {
      setAlertEmailRequired(email === null);
      return;
    }
    if(!isPasswordValid){
      setAlertPasswordRequired(password === null);
      return;
    }

    setIsLoading(true)

  // Post the fetch request with the supplied credentials.
  await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
      credentials: 'include'
    }).then(response => {
      if (!response.ok) { throw new Error(response.status) }
      return response.json()
    }).then(data => {
      navigate('/landing')
    }).catch(error => {
      setIsLoginUnsuccessful(true)
    })

    setIsLoading(false)
  }

  return (
        <Container sx={{ borderRadius:{xs:0, sm:2}, padding:'25px', 
          alignItems:'center', boxShadow:24, backgroundColor:'#ffffff', }}>
          <Box component='form' onSubmit={handleLogin}>
            <Stack spacing={{xs:2}}>
              {generateUnsuccessfulLoginAlert()}
              <EmailInputField onChange={validateEmail} 
                showRequired={alertEmailRequired} />
              <PasswordInputField onChange={validatePassword} truncate={true}
                restrictLength={false} showRequired={alertPasswordRequired}/>
              <Button loading={isLoading} type='submit' variant="contained" sx={{ 
                py:{xs:'1rem', sm:'.9rem'}, fontSize:{xs:'1.2rem', sm:'1rem'} }}>
                Login
              </Button>
              <Button href='/register' variant="outlined" sx={{ 
                py:{xs:'1rem', sm:'.9rem'}, fontSize:{xs:'1.2rem', sm:'1rem'} }}>
                Create Account
              </Button>
              <Divider variant="middle" aria-hidden="true" sx={{py:'5px'}}/>
              <Stack direction='row' spacing={{xs:1}} 
                  style={{ justifyContent:"center"}}> 
                <Typography align='center' style={{ color:'#888888' }}>Forgot 
                    your password?</Typography>
                <Link href="" align='center' fontWeight='bold' >Click Here</Link>
              </Stack>
            </Stack>
          </Box>
        </Container>
  )
}

export default LoginForm
