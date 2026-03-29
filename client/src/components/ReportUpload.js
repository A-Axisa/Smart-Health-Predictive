import {Box, Button, Typography, ListItem, List} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Styles for upload button
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

  const [isLoading, setIsLoading] = useState(false); // Stores loading state
  
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    // Retrieve the selcted file from upload
    const file = e.target.files[0];

    // Add file to FormData object for request
    const formData = new FormData();
    formData.append("uploaded_file", file);

    setIsLoading(true);

    // Sends the file to the upload endpoint for parsing
  await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      })
      navigate('/merchant-reports');
      setIsLoading(false);
  }

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
      <Typography sx={{color: 'grey', mb: 4}}>Only PDF (.pdf) or CSV (.csv) files are accepted.</Typography>
      <Button component='label' role='undefined' variant='contained' tabIndex={-1} color='info' size='large' startIcon={<FileUploadIcon/>} loading={isLoading}>
        Upload File
        <HiddenInput
          type='file'
          accept='.csv'
          onChange={handleUpload}
        />
      </Button>
      {/* <Box>
        <Button variant='contained' color='primary' sx={{mt:'20px'}} onClick={handleSubmit}>
          Submit
        </Button>
      </Box> */}
    </Box>
  )
}

export default ReportUpload
