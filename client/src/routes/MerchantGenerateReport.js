import {Container, ButtonGroup, Button, Box} from '@mui/material'
import MerchantReportForm from '../components/MerchantReportForm'
import { useState } from 'react'


const MerchantGenerateReport = ({}) => {
  
  const [page, setPage] = useState('ReportForm')
  const [inputchoice, setinputchoice] = useState('Manual')

  return (
    <Container>
      <Box center sx={{display: 'flex', justifyContent: 'center', p:4}}>
        <ButtonGroup disableElevation aria-label="disable button group">
          <Button>Manual Input</Button>
          <Button>Upload</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{p:4}}>
        <MerchantReportForm />
      </Box>
    </Container>
    
  )
}

export default MerchantGenerateReport