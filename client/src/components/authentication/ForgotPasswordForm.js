
import { useState } from 'react'
import { Box, Container, Stack, Button, Link, Divider } from '@mui/material'
import EmailInputField from './EmailInputField';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Provides the user a form to request a password reset using their email.
 */
const LoginForm = () => {
  const [email, setEmail] = useState(null)
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [alertEmailRequired, setAlertEmailRequired] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function validateEmail(e) {
    setAlertEmailRequired(false);
    setIsEmailValid(e.isValid);
    setEmail(e.email.trim());
  }

  async function handleSubmit(e) {

  }

  return (
        <Container 
          sx={{
            borderRadius:{xs:0, sm:2},
            padding:'25px',
            alignItems:'center',
            boxShadow:24,
            backgroundColor:'#ffffff',
            width: { xs: "auto", sm: "500px" },
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          <Box component='form' onSubmit={handleSubmit}>
            <Stack spacing={{xs:2}}>
              <EmailInputField onChange={validateEmail} 
                showRequired={alertEmailRequired} />
              <Button loading={isLoading} type='submit' variant="contained" sx={{ 
                py:{xs:'1rem', sm:'.9rem'}, fontSize:{xs:'1.2rem', sm:'1rem'} }}>
                Reset Password
              </Button>
              <Divider variant="middle" aria-hidden="true" sx={{py:'5px'}}/>
              <Stack direction='row' spacing={{xs:1}} 
                  style={{ justifyContent:"center"}}> 
                <Link href="/login" align='center' fontWeight='bold' >Return to login</Link>
              </Stack>
            </Stack>
          </Box>
        </Container>
  )
}

export default LoginForm
