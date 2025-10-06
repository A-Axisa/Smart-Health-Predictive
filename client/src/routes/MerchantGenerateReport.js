import {Container, ButtonGroup, Button, Box} from '@mui/material'
import MerchantReportForm from '../components/MerchantReportForm'
import ReportUpload from '../components/ReportUpload'
import { useState } from 'react'


const MerchantGenerateReport = ({}) => {
  
  const [page, setPage] = useState('manual')

  return (
    <Container>
      <Box center sx={{display: 'flex', justifyContent: 'center', p:5}}>
        <ButtonGroup disableElevation aria-label="disable button group">
          <Button
          variant={page === 'manual' ? 'contained' : 'outlined'}
          onClick={() => setPage('manual')}>Form Input</Button>
          <Button
          variant={page === 'upload' ? 'contained' : 'outlined'}
          onClick={() => setPage('upload')}>Import</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{p:4}}>
        {page == 'manual' ? (<MerchantReportForm/>) : (<ReportUpload/>)}
      </Box>
    </Container>
  )
}

export default MerchantGenerateReport