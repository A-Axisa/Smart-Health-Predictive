import { Button, Container } from '@mui/material'
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import pdfToText from 'react-pdftotext'

const BloodReportUpload = ({ onChange }) => {

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

  async function processBloodReport(e) {
      const file = e.target.files[0];
      await pdfToText(file)
        .then(text => onChange?.(extractPatientInfoAsDict(text)))
        .catch(error => console.error(error));
  }

  function extractPatientInfoAsDict(text) {
    // Format text to simplify searching for information.
    const regexMultipleSpaces = /\s+/g;
    let formattedText = text.replace(regexMultipleSpaces, " ").toLowerCase().split(' ');

    const bloodGlucoseLabel = ("hba1c");
    const bloodGlucoseOffset = 4;
    const cholesterolLabel = ("tchol/hdl");
    const cholesterolOffset = 4;
    const diabetesThreshold = 45;
    const highCholesterolThreshold = 5.1;
    let bloodGlucoseLevel = Number(formattedText[formattedText.indexOf(bloodGlucoseLabel) + bloodGlucoseOffset ]);
    let cholesterolLevel = Number(formattedText[formattedText.indexOf(cholesterolLabel) + cholesterolOffset ]);

    return {
      "bloodGlucose": bloodGlucoseLevel,
      "isDiabetic": bloodGlucoseLevel >= diabetesThreshold,
      "hasHighCholesterol": cholesterolLevel >= highCholesterolThreshold,
    };
  }

    return (
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<FileUploadIcon />}
        >
          Upload Blood Report
          <HiddenInput
            type="file"
            onChange={processBloodReport}
          />
        </Button>
    )
}

export default BloodReportUpload;
