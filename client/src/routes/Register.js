import { Container} from '@mui/material'
import RegistrationForm from '../components/authentication/RegistrationForm'

const Register = ({}) => {
  return (
    <Container maxWidth={false} sx={{backgroundColor:'#127067', width:'100vw',
      height:'100dvh', padding:'0', margin:'0', display:'flex', 
      alignItems:'center', justifyContent:'center'}}  >
      <RegistrationForm />
    </Container>
  )
}

export default Register
