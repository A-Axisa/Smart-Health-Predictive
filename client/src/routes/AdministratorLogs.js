import AuditLogTable from "../components/administrator/AuditLogTable";
import { Box } from "@mui/material";


const AdministratorLogs = () => {
  return (
    <Box
      sx={{
        ml: "250px",
        mt: "66px",
      }}
    >
      <AuditLogTable />
    </Box>
  );
}

export default AdministratorLogs;
