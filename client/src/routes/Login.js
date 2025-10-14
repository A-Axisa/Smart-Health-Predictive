import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { Box, Container, Stack, TextField, Button, Typography, 
    Link, Alert } from '@mui/material'
import PasswordInputField from '../components/authentication/PasswordInputField';
import EmailInputField from '../components/authentication/EmailInputField';

const Login = ({}) => {
  const navigate = useNavigate();
  const [isLoginUnsuccessful, setIsLoginUnsuccessful] = useState(false);
  const [password, setPassword] = useState(null)
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [alertPasswordRequired, setAlertPasswordRequired] = useState(false)
  const [email, setEmail] = useState(null)
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [alertEmailRequired, setAlertEmailRequired] = useState(false)

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
      return <Alert variant="filled" severity="error"> Login details are incorrect</Alert>
    }
    return null
  }

  async function handleLogin(e) {
    e.preventDefault();

    if(!isEmailValid) {
      setAlertEmailRequired(email === null);
      return;
    }
    if(!isPasswordValid){
      setAlertPasswordRequired(password === null);
      return;
    }

    await fetch('http://localhost:8000/login', {
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
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    }).then(data => {
      navigate('/user-landing')
    }).catch(error => {
      setIsLoginUnsuccessful(true)
    })
  }

  return (
    <Box sx={{ backgroundColor:'#127067',  width:'100vw', height:'100vh', 
        padding:'0', margin:'0'}}>

      <Box sx={{ backgroundImage:'linear-gradient(to top left, #133a37ff, #127067)',
            width:'60%', height:'100vh', flex:'inline', float:'left'}}>
        <Container style={{padding:'100px'}}>
          <Stack>
            <Typography style={{ color:"#e7f1f1ff", fontWeight:'bold', 
                fontSize:'100px' }}>Welcome</Typography>
            <Typography style={{ color:"#cae4e4ff" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
              facilisis arcu et ex tristique, ut hendrerit est posuere. Nunc 
              fringilla commodo neque vel scelerisque. Sed id dictum massa, eu 
              tristique enim. Vestibulum pellentesque quis nibh et egestas. 
              Nulla efficitur quam et venenatis rhoncus. Quisque nec odio a 
              ligula facilisis semper vel ut mi. Quisque ac nulla tortor. 
              Curabitur egestas dictum risus, ac efficitur diam vulputate sed. 
              Vivamus sed tortor nunc.
            </Typography>
          </Stack>  
        </Container>
      </Box>

      <Box sx={{ backgroundColor:'#ffffff', width:'40%', height:'100%', 
            flex:'inline', float:'left', display:'flex', alignItems:'center'}}>
        <Container sx={{ width:'70%', borderRadius:2, padding:'25px', 
                alignItems:'center', boxShadow:24}}>
          <Box component='form' onSubmit={handleLogin}>
            <Stack spacing={{xs:2}}>
              <h1>Sign In</h1>
              {generateUnsuccessfulLoginAlert()}
              <EmailInputField onChange={validateEmail} 
                showRequired={alertEmailRequired} />
              <PasswordInputField onChange={validatePassword} truncate={true}
                restrictLength={false} showRequired={alertPasswordRequired}/>
              <Button type='submit' variant="contained">Login</Button>
              <Button href='/register' variant="outlined">Sign up</Button>
              <Stack direction='row' spacing={{xs:1}} 
                  style={{ justifyContent:"center"}}> 
                <Typography align='center' style={{ color:'#888888' }}>Forgot 
                    your password?</Typography>
                <Link href="" align='center' fontWeight='bold' >Click Here</Link>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
      
    </Box>
  )
}

export default Login
