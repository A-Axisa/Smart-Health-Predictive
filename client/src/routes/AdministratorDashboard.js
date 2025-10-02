import { Box, Typography, List, ListItem, ListItemText, Container } from '@mui/material';
import UserManagementTable from '../components/UserManagementTable';
import { useState } from 'react';


const AdministratorDashboard = () => {

  const [page, setPage] = useState({});

  const UserManagement = () => (
      <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
          <Typography variant='h4' color='primary' sx={{fontWeight: 600}}>
            User Management
          </Typography>
        </Box>
        <UserManagementTable/>
      </Box>
  );

  const pages = {
    Users: <UserManagement/>
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
            {['Users'].map((obj) => (
              <ListItem
                button
                key={obj}
                selected={page === obj}
                onClick={() => setPage(obj)}
              >
                <ListItemText primary={obj}/>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{p: 4}}>
          {pages[page]}
        </Box>
      </Box>
    </Container>
  );
};

export default AdministratorDashboard;
