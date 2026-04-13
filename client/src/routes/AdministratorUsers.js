import UserManagementTable from "../components/administrator/UserManagementTable";
import { Box } from "@mui/material";

const AdministratorUsers = () => {
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
      <UserManagementTable />
    </Box>
  );
};

export default AdministratorUsers;
