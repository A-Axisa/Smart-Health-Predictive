import { Button, Container } from '@mui/material'
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const BloodReportUpload = ({}) => {

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

    return (
      <Container>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<FileUploadIcon />}
        >
          Upload Blood Report
          <HiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
          />
        </Button>
      </Container>
    )
}

export default BloodReportUpload;
