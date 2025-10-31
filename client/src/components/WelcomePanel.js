import { Box, Stack, Typography } from '@mui/material'

/**
 * An panel that introduce the web service.
 */
const WelcomePanel = ({}) => {
  return (
    <Box sx={{ display:{xs:'none', sm:'none', md:'none', lg:'block'}, 
      backgroundImage:'linear-gradient(to top left, #133a37ff, #127067)',
      height:'100vh', flex:'inline', float:'left'}}>
      <Stack sx={{padding:5}}>
        <Typography  style={{ color:"#e7f1f1ff", fontWeight:'bold', 
          fontSize:'80px' }}>Smart Health Predictive</Typography>
        <Typography noWrap={true} style={{ color:"#e7f1f1ff", fontWeight:'bold', 
          fontSize:'80px' }}> </Typography>
        <Typography style={{ color:"#cae4e4ff" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
          facilisis arcu et ex tristique, ut hendrerit est posuere. Nunc 
          fringilla commodo neque vel scelerisque. Sed id dictum massa, eu 
          tristique enim. Vestibulum pellentesque quis nibh et egestas.
        </Typography>
      </Stack>  
    </Box>
  );
}

export default WelcomePanel;
