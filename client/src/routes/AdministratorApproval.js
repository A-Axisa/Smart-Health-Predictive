import AccountApprovalTable from "../components/administrator/AccountApprovalTable";
import { Box } from "@mui/material";


const AdministratorApproval = () => {
  return (
    <Box
      sx={{
        ml: "250px",
        mt: "66px",
      }}
    >
      <AccountApprovalTable />
    </Box>
  );
}

export default AdministratorApproval;
