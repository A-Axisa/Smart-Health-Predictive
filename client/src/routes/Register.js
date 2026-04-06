import { Container} from '@mui/material'
import RegistrationForm from '../components/authentication/RegistrationForm'

/** 
 * A page used to display registration information and provide a form to allow
 * users to register.
*/
const Register = () => {
  return (
    <Container maxWidth={false} sx={{backgroundColor:'#127067', width:'100vw',
      height:'100dvh', padding:'0', margin:'0', display:'flex', 
      alignItems:'center', justifyContent:'center'}}  >
      <RegistrationForm />
    </Container>
  );
}

export default Register;
