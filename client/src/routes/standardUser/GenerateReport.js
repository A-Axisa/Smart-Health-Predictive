import GenerateReportForm from "../../components/healthReport/GenerateReportForm";
import { Box } from "@mui/material";

/**
 * A page that provides the form for user's to generate a health report.
 *
 * @returns {@mui.material.Box}
 */
const GenerateReport = ({}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        ml: "65px",
        mt: "66px",
      }}
    >
      <GenerateReportForm />
    </Box>
  );
};

export default GenerateReport;
