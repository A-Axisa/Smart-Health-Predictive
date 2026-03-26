import UserManagementTable from "../components/administrator/UserManagementTable";
import { Box } from "@mui/material";


const AdministratorUsers = () => {
  return (
    <Box
      sx={{
        ml: "250px",
        mt: "66px",
      }}
    >
      <UserManagementTable />
    </Box>
  );
}

export default AdministratorUsers;
