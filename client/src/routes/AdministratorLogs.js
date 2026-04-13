import AuditLogTable from "../components/administrator/AuditLogTable";
import { Box } from "@mui/material";

const AdministratorLogs = () => {
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
      <AuditLogTable />
    </Box>
  );
};

export default AdministratorLogs;
