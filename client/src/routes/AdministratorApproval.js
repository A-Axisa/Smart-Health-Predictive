import AccountApprovalTable from "../components/administrator/AccountApprovalTable";
import { Box } from "@mui/material";

const AdministratorApproval = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: 10,
        alignItems: "center",
        ml: "250px",
        mt: "66px",
      }}
    >
      <AccountApprovalTable />
    </Box>
  );
};

export default AdministratorApproval;
