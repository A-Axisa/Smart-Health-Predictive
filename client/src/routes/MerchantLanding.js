import { Container, Box, Typography, Button } from '@mui/material'
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MerchantLanding = ({ }) => {
  const navigate = useNavigate();

  async function logout(e) {
    e.preventDefault();

    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    }).then(data => {
      navigate('/login')
    })
  }

  return (
    <Container sx={{ minHeight: '75vh', justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'relative'}}>
      <Box sx={{ justifyContent: 'right', top: 20, right: 20, position: 'absolute'}}>
        <Button href="/user-settings" variant='outlined'>Settings</Button>
      </Box>
      <Box sx={{ justifyContent: 'left', top: 20, left: 20, position: 'absolute' }}>
        <Button variant="outlined" onClick={logout}>Logout</Button>
      </Box>

      <Box sx={{mb:6}}>
        <Typography variant='h2' align="center" fontWeight={700}>
          Welcome
        </Typography>
        
        <Typography variant='h6' color='gray'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at ante at erat tempus laoreet. 
        </Typography>
      </Box>

      <Button href="/merchant-generate-report" size="large" variant="contained">Get Started</Button>

      <Box sx={{display: 'flex', flexDirection: 'row', mt: 4, gap: 3}}>
        {/*<Box sx={{p:3, borderRadius: 3, boxShadow: 3}}>*/}
        {/*  <Typography variant='h5'>*/}
        {/*    View analytics*/}
        {/*  </Typography>*/}
        {/*  <Typography variant='h7' color='gray'>*/}
        {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit.*/}
        {/*  </Typography>*/}
        {/*    <Button size="large" variant="contained" sx={{display: 'flex', width: "150px", mt: "10px"}}>*/}
        {/*      View*/}
        {/*    </Button>*/}
        {/*</Box>*/}
        <Box sx={{p:3, borderRadius: 3, boxShadow: 3}}>
          <Typography variant='h5'>
            View Report History
          </Typography>
          <Typography variant='h7' color='gray'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
            <Button href="/merchant-reports" size="large" variant="contained" sx={{display: 'flex', width: "150px",  mt: "10px"}}>
              View
            </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default MerchantLanding
