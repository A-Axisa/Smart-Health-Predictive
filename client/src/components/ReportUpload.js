import {Box, Button, Typography} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';


const HiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ReportUpload = ({}) => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
      <Typography sx={{color: 'grey', mb: 4}}>Only PDF (.pdf) or Excel (.xlsx) files are accepted.</Typography>
      <Button component='label' role='undefined' variant='contained' tabIndex={-1} color='info' size='large' startIcon={<FileUploadIcon/>}>
        Upload File
        <HiddenInput
          type='file'
          // onChange={(event) => console.log(event.target.files)}
          multiple
        />
      </Button>
    </Box>
  )
}

export default ReportUpload