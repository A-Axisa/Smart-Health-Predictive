import { Box, Container, Stack, Typography } from '@mui/material'
import LoginForm from '../components/authentication/LoginForm'
import Logo from '../assets/WellAiLogoTR.png'
import WelcomePanel from '../components/WelcomePanel'

/**
 * Introduces the services and provides forms for logging in to 
 * the service.
 */
const Login = () => {
  return (
    <Stack direction='row' sx={{ backgroundColor:'#127067'}}>
      <WelcomePanel />
      <Box sx={{px:{xs:0, sm:5, md:20, lg:10, xl:10,}, display: 'flex', 
        alignItems:'center', justifyContent:'center', height:'100vh', 
        backgroundColor:'#efefef', flexGrow:{xs:1, sm:1, md:1, lg:0}}}>
        <Stack direction={'column'} alignItems={'center'} sx={{px:0, mx:0, 
          flexGrow:{xs:1, sm:0}, width:{xs:'auto', sm:'500px'}}}>
          <Box component='img' alt='Well AI Logo' src={Logo} 
            sx={{padding:{sm:1, lg:5}, width:'20em'}}/>
          <Container sx={{ display:{ md:'block', lg:'none'}}}>
            <Typography align='center' sx={{py:3, fontSize:'2.4rem', 
              fontWeight:'bold'}}>
              Smart Health Predictive
            </Typography>
          </Container>
          <LoginForm/>
        </Stack>
      </Box>
    </Stack>
  );
}

export default Login;
