import GenerateReportForm from "../components/GenerateReportForm";
import {Box} from "@mui/material";


const GenerateReport = ({}) => {
  return (
    <Box sx={{minHeight: '100vh',bgcolor: '#f5f5f5', display: 'flex'}}>
      <GenerateReportForm />
    </Box>
    );
}

export default GenerateReport
