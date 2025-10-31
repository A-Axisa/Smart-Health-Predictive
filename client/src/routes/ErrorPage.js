import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Typography align='center' variant='h3' >404</Typography> 
        <Typography align='center' variant='h5' >Page Not Found </Typography>
      </Grid>
      <Button type='submit' onClick={() => navigate("/")} variant="contained" size="large">Return </Button>
    </Grid>


  );
}
export default ErrorPage;