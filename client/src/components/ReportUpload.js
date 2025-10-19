import {Box, Button, Typography, ListItem, List} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const [data, setData] = useState([]); // Stores the uploaded health data
  
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    // Retrieve the selcted file from upload
    const file = e.target.files[0];

    // Add file to FormData object for request
    const formData = new FormData();
    formData.append("file", file);

    // Sends the file to the upload endpoint for parsing
    await fetch(`http://localhost:8000/upload`, {
      method: 'POST',
      body: formData, 
    }).then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch((err) => {
        console.log(err);
      });
  }

  // Passes uploaded data to the AIPrediction endpoint
  const handleSubmit = async () => {
    for (const entry of data) {
      await fetch(`http://localhost:8000/AIPrediction`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(entry),
      });
    }
    navigate('/ai-health-prediction')
  }

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
      <Typography sx={{color: 'grey', mb: 4}}>Only PDF (.pdf) or CSV (.csv) files are accepted.</Typography>
      <Button component='label' role='undefined' variant='contained' tabIndex={-1} color='info' size='large' startIcon={<FileUploadIcon/>}>
        Upload File
        <HiddenInput
          type='file'
          accept='.csv'
          onChange={handleUpload}
        />
      </Button>
      <Box>
        <Button variant='contained' color='primary' sx={{mt:'20px'}} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}

export default ReportUpload
