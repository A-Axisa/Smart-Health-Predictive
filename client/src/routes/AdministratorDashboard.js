import { Box, Typography, List, ListItem, ListItemText, Container,Button  } from '@mui/material';
import UserManagementTable from '../components/administrator/UserManagementTable';
import AccountApprovalTable from '../components/administrator/AccountApprovalTable';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';


const AdministratorDashboard = () => {

  const [page, setPage] = useState({});

  const navigate = useNavigate();

  async function logout(e) {
    e.preventDefault();

    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    }).then(data => {
      navigate('/login')
    })
  }

  const UserManagement = () => (
      <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', p:10, alignItems: 'center'}}>
        <Box>
          <Typography variant='h4' color='primary' sx={{fontWeight: 600, mb: 4}}>
            User Management
          </Typography>
        </Box>
        <UserManagementTable/>
      </Box>
  );

    const AccountApproval = () => (
      <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', p:10, alignItems: 'center'}}>
        <Box>
          <Typography variant='h4' color='primary' sx={{fontWeight: 600, mb: 4}}>
            Merchant Account Requests
          </Typography>
        </Box>
        <AccountApprovalTable/>
      </Box>
  );

  const pages = {
    Users: <UserManagement/>,
    Requests: <AccountApproval/>
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', minHeight: '100vh',  }}>
        <Box sx={{borderRight: '1px solid #e0e0e0' }}>
          <List sx={{ padding: 0 }}>
            <Box sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
            </Box>
            {['Users', 'Requests'].map((obj) => (
              <ListItem
                button
                key={obj}
                selected={page === obj}
                onClick={() => setPage(obj)}
              >
                <ListItemText primary={obj}/>
              </ListItem>
            ))}
            <ListItem>
              <Button variant="outlined" onClick={logout}>Logout</Button>
            </ListItem>
            
          </List>
         
        </Box>
        <Box>
          {pages[page]}
        </Box>
      </Box>
    </Container>
  );
};

export default AdministratorDashboard;
