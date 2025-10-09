import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, TextField, Button, Typography, 
    Link, FormControlLabel, Checkbox } from '@mui/material'

const ACCOUNT_TYPES = Object.freeze({
  STANDARD: 1,
  MERCHANT: 3,
})

const Register = ({}) => {
  const navigate = useNavigate();

  function validateName(e) {
    console.log('Name validated.');
  }

  function validatePhone(e) {
    console.log('Phone validated.');
  }

  function validateEmail(e) {
    console.log('Email validated.');
  }

  function validatePassword(e) {
    console.log('Password validated.');
  }

  async function handleRegistration(e) {
    e.preventDefault();
    
    const new_account_type = e.target.is_merchant_account.value ? 
      ACCOUNT_TYPES.MERCHANT : ACCOUNT_TYPES.STANDARD

    await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: e.target.full_name.value,
        password: e.target.password.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        account_type: new_account_type
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    }).then(data => {
      navigate('/login')
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <Box sx={{ backgroundColor:'#127067',  width:'100vw', height:'100vh', 
        padding:'0', margin:'0'}}>

      <Box sx={{backgroundImage:'linear-gradient(to top left, #133a37ff, #127067)',
          width:'100%', height:'100%', flex:'inline', float:'left', display:'flex',
          alignItems:'center'}}>
        <Container sx={{ backgroundColor:'#ffffff', width:'30%', borderRadius:2, 
            padding:'25px', alignItems:'center', boxShadow:24}}>
          <Box component='form' onSubmit={handleRegistration}>
            <Stack spacing={{xs:2}}>
              <h1>Create Account</h1>
              <TextField id='outlined-input' name='full_name' label='Full Name' 
                  onChange={validateName}></TextField>
              <TextField id='outlined-input' name='phone' label='Phone' 
                  onChange={validatePhone}></TextField>
              <TextField id='outlined-input' name='email' label='Email' 
                  onChange={validateEmail}></TextField>
              <TextField id='outlined-password-input' name='password' label='Password' 
                  type='password' onChange={validatePassword}></TextField>
              <TextField id='outlined-password-input' name='confirm_password' label='Confirm Password' 
                  type='password' onChange={validatePassword}></TextField>
              <FormControlLabel control={<Checkbox name='is_merchant_account' />} label='Merchant Account' />
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
