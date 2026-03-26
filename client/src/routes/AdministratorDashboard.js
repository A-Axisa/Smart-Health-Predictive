import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Button,
} from "@mui/material";
import UserManagementTable from "../components/administrator/UserManagementTable";
import AccountApprovalTable from "../components/administrator/AccountApprovalTable";
import AuditLogTable from "../components/administrator/AuditLogTable";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const AdministratorDashboard = () => {
  const [page, setPage] = useState({});

  const navigate = useNavigate();

  const UserManagement = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: 10,
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, mb: 4 }}
        >
          Users
        </Typography>
      </Box>
      <UserManagementTable />
    </Box>
  );

  const AccountApproval = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: 10,
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, mb: 4 }}
        >
          Merchant Account Requests
        </Typography>
      </Box>
      <AccountApprovalTable />
    </Box>
  );

  const AuditLogs = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: 10,
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, mb: 4 }}
        >
          Logs
        </Typography>
      </Box>
      <AuditLogTable />
    </Box>
  );

  const pages = {
    Users: <UserManagement />,
    Requests: <AccountApproval />,
    Logs: <AuditLogs />,
  };

  return (
    <Container>
      <Box sx={{ display: "flex", minHeight: "100vh", ml: "250px", mt: "66px", }}>
        <Box sx={{ borderRight: "1px solid #e0e0e0" }}>
          <List sx={{ padding: 0 }}>
            {["Users", "Requests", "Logs"].map((obj) => (
              <ListItem
                button
                key={obj}
                selected={page === obj}
                onClick={() => setPage(obj)}
              >
                <ListItemText primary={obj} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box>{pages[page]}</Box>
      </Box>
    </Container>
  );
};

export default AdministratorDashboard;
