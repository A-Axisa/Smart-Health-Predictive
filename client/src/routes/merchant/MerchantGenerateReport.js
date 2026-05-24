import { Container, ButtonGroup, Button, Box } from "@mui/material";
import MerchantReportForm from "../../components/healthReport/MerchantReportForm";
import { useState } from "react";

/**
 * A page that provides the health report form for merchants to generate
 * reports for their patients.
 *
 * @returns {@mui.material.Container}
 */
const MerchantGenerateReport = ({}) => {
  const [page, setPage] = useState("manual");

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
      <MerchantReportForm />
    </Box>
  );
};

export default MerchantGenerateReport;
