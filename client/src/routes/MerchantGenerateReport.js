import {Container, ButtonGroup, Button, Box} from '@mui/material'
import MerchantReportForm from '../components/MerchantReportForm'
import ReportUpload from '../components/ReportUpload'
import { useState } from 'react'


const MerchantGenerateReport = ({}) => {
  
  const [page, setPage] = useState('manual')

  return (
    <Container>
      <Box center sx={{display: 'flex', justifyContent: 'center', p:4}}>
        <ButtonGroup disableElevation aria-label="disable button group">
          <Button onClick={() => setPage('manual')}>Manual Input</Button>
          <Button onClick={() => setPage('upload')}>Upload</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{p:4}}>
        {page == 'manual' ? (<MerchantReportForm/>) : (<ReportUpload/>)}
      </Box>
    </Container>
    
  )
}

export default MerchantGenerateReport