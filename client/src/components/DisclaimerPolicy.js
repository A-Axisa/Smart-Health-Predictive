import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button
} from "@mui/material";


const DisclaimerPolicy = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 600 }}>Disclaimer Policy</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Important Information:</Typography>
        <Typography sx={{ mb: 3 }}>
          This health predictive application (“App”) provides information and recommendations for your health and wellness. Please carefully read and understand this disclaimer before using the App.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Accuracy and Limitations:</Typography>
        <Typography sx={{ mb: 3 }}>
          The App's predictions are based on algorithms trained on various health data sources and general health knowledge. These predictions are not the result of medical studies and should not be considered definitive diagnoses or medical advice.
          The App does not claim to replace or substitute for professional medical advice, diagnosis, or treatment.
          Always consult with your doctor or other qualified healthcare professional before making any changes to your diet, exercise routine, or other health-related decisions.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Health Recommendations:</Typography>
        <Typography sx={{ mb: 3 }}>
          The App offers personalized health recommendations based on your input and the expertise of qualified dietitians. These recommendations are intended to provide general guidance and support for improving your health and well-being.
          The recommendations are not individualized medical advice and may not be suitable for everyone. You should always discuss any recommended changes with your doctor or other qualified healthcare professional before implementing them.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Data Privacy and Security:</Typography>
        <Typography sx={{ mb: 3 }}>
          We take your privacy seriously and are committed to protecting your personal information. Please refer to our Privacy Policy for details on how we collect, use, and protect your data.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Additional Disclaimer:</Typography>
        <Typography sx={{ mb: 3 }}>
          We make no guarantees or warranties, express or implied, regarding the accuracy, completeness, or reliability of the information provided by the App.
          The App is provided “as is” and “as available” without any warranties or guarantees of any kind.
          We are not responsible for any damages or injuries that may arise from your use of the App.
          By using the App, you agree to the terms and conditions of this Disclaimer.
        </Typography>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Contact Us:</Typography>
        <Typography sx={{ mb: 3 }}>
          If you have any questions or concerns about this Disclaimer, please contact us at contactus@wellai.app.
          This disclaimer is for informational purposes only and does not constitute legal advice. Please consult with an attorney for legal advice.
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <Button onClick={onClose}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerPolicy;