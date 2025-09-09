import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, TextField, Button, Typography, 
    Link } from '@mui/material'

const Login = ({}) => {
  const navigate = useNavigate();

  function validateEmail(e) {
    console.log('Email validated.');
  }

  function validatePassword(e) {
    console.log('Password validated.');
  }

  function handleLogin(e) {
    e.preventDefault();
    console.log('Logged in successfully!');
    navigate('/user-landing')
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
              <TextField id='outlined-input' label='Email' 
                  onChange={validateEmail}></TextField>
              <TextField id='outlined-password-input' label='Password' 
                  type='password' onChange={validatePassword}></TextField>
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
