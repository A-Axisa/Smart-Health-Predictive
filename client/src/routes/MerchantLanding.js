import { Container, Box, Typography, Button } from '@mui/material'


const MerchantLanding = ({}) => {
  return (
    <Container sx={{ minHeight: '75vh', justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'relative'}}>
      <Box sx={{ justifyContent: 'right', top: 20, right: 20, position: 'absolute'}}>
        <Button href="/user-settings" variant='outlined'>Settings</Button>
      </Box>
      <Box sx={{mb:6}}>
        <Typography variant='h2' fontWeight={700}>
          Welcome, [Username]
        </Typography>
        <Typography variant='h6' color='gray'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at ante at erat tempus laoreet. 
        </Typography>
      </Box>

      <Button href="/merchant-generate-report" size="large" variant="contained">Get Started</Button>

      <Box sx={{display: 'flex', flexDirection: 'row', mt: 4, gap: 3}}>
        <Box sx={{p:3, borderRadius: 3, boxShadow: 3}}>
          <Typography variant='h5'>
            View analytics
          </Typography>
          <Typography variant='h7' color='gray'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
        </Box>
        <Box sx={{p:3, borderRadius: 3, boxShadow: 3}}>
          <Typography variant='h5'>
            View Report History
          </Typography>
          <Typography variant='h7' color='gray'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default MerchantLanding
