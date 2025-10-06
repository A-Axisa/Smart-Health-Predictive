import {Box, Button, Typography} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';


const ReportUpload = ({}) => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
      <Typography sx={{color: 'grey', mb: 4}}>Only PDF (.pdf) or Excel (.xlsx) files are accepted.</Typography>
      <Button variant='contained' color='info' size='large'>
        Upload File <FileUploadIcon/>
      </Button>
    </Box>
  )
}

export default ReportUpload