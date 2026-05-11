import { Container, ButtonGroup, Button, Box } from "@mui/material";
import MerchantReportForm from "../components/MerchantReportForm";
import { useState } from "react";

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
