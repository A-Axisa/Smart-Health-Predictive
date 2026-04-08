import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import logo from "../assets/WellAiLogoTR.png";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { UserContext } from "../utils/UserContext";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import TimelineIcon from '@mui/icons-material/Timeline';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FileCopyIcon from '@mui/icons-material/FileCopy';


const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const NavBar = ({ role }) => {

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  
  // Page options for each user type
  const standardUserPages = [
    {icon: <DashboardIcon />, title: "Dashboard"},
    {icon: <RestorePageIcon />, title: "Generate Report"},
    {icon: <HistoryIcon/>, title: "Report History"},
    {icon: <TimelineIcon/>, title: "Health Analytics"}
  ];

  const settings = [
    {icon: <SettingsIcon sx={{ colo: "#383838" }}/>, title: "Account"},
    {icon: <LogoutIcon sx={{ color: "#ff4f4f" }}/>, title: "Logout"}
  ];

  const merchantPages = [
    {icon: <DashboardIcon/>, title: "Dashboard"},
    {icon: <RestorePageIcon />, title: "Generate Report"},
    {icon: <HistoryIcon/>, title: "Report History"}
  ];

  const adminPages = [
    {icon: <DashboardIcon/>, title: "Dashboard"},
    {icon: <GroupIcon/>, title: "Users"},
    {icon: <HowToRegIcon/>, title: "Account Requests"},
    {icon: <FileCopyIcon/>, title: "Audit Logs"}
  ];

  // Check if settings menu is open
  const [openMenu, setOpenMenu] = useState(null);

  // User Logout
  async function logout() {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setUser(null);
        navigate("/login");
      });
  }

  // Handle navigation for each page option
  function handleNavigate(page) {
    setSelectedPage(page);
    if (page === "Dashboard") {
      if (role === "standard_user") {
        navigate("/user-landing");
      }
      if (role === "merchant") {
        navigate("/merchant-landing");
      }
      if (role === "admin") {
        navigate("/admin-dashboard")
      }
    }
    if (page === "Generate Report") {
      if (role === "standard_user") {
        navigate("/generate-report");
      }
      if (role === "merchant") {
        navigate("/merchant-generate-report");
      }
    }
    if (page === "Report History") {
      if (role === "standard_user") {
        navigate("/ai-health-prediction");
      }
      if (role === "merchant") {
        navigate("/merchant-reports");
      }
    }
    if (page === "Health Analytics") {
      navigate("/health-analytics");
    }
    if (page === "Account") {
      handleCloseSettings();
      navigate("/user-settings");
    }
    if (page === "Logout") {
      handleCloseSettings();
      logout();
    }
    if (page === "Users") {
      if (role === "admin") {
        navigate("/admin-users")
      }
    }
    if (page === "Account Requests") {
      if (role === "admin") {
        navigate("/admin-account-approval")
      }
    }
    if (page === "Audit Logs") {
      if (role === "admin") {
        navigate("/admin-audit-logs")
      }
    }
  }

  function handleOpenSettings(e) {
    setOpenMenu(e.currentTarget);
    console.log(openMenu);
  }

  function handleCloseSettings() {
    setOpenMenu(null);
  }

  // Navigation Bar for standard user type
  if (role === "standard_user")
    return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          borderBottom: "2px solid #e9e9e9",
        }}
      >
        <Toolbar disableGutters>
          {/*Title/Logo Section*/}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-start",
              pl: 2,
            }}
          >
          <Box component='img' alt='WellAI Logo' src={logo}
            onClick={() => navigate("/user-landing")}
            sx={{height: 50, cursor: "pointer"}}
          />
          </Box>
          {/*Account Settings Section  */}
          <Box sx={{ flexGrow: 0 }}>
            <Button color="inherit">
              <AccountCircleIcon
                fontSize="large"
                onClick={handleOpenSettings}
                sx={{ p: 0, color: "#383838" }}
              ></AccountCircleIcon>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={openMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(openMenu)}
                onClose={handleCloseSettings}
              >
                {settings.map((page) => (
                  <MenuItem
                    key={page.title}
                    onClick={() => handleNavigate(page.title)}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {page.icon}
                    <Typography>{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Nav options relocated here. */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          borderRight: "2px solid #e9e9e9",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            top: "66px",
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            height: "780px",
          }}
          >
          <Typography color="#A9A9A9" sx={{ fontSize: 12, px: 3, py: 1, mt: 5 }}>
            Overview
          </Typography>
          <List>
            {standardUserPages.map((page) => (
              <ListItemButton
                key={page.title}
                sx={{
                  color: selectedPage === page.title ? "#fff" : "383838",
                  backgroundColor: selectedPage === page.title ? "#712b89" : "transparent",
                  borderRadius: "10px",
                  ml: 2,
                  mr: 2,
                  mb: 1,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: selectedPage === page.title ? "#712b89" : "",
                  }
                }}
                onClick={() => handleNavigate(page.title)}
              >
                {page.icon} <ListItemText primary={page.title} sx={{ ml: 3 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            borderTop: "2px solid #e9e9e9",
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography color="#A9A9A9" sx={{ fontSize: 12 }}>
            © 2024 WellAI. All rights reserved. Privacy Notice & Disclaimer Policy
          </Typography>
        </Box>
      </Drawer>
      </>
    );

  // Navigation Bar for merchant user type
  if (role === "merchant")
    return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          borderBottom: "2px solid #e9e9e9",
        }}
      >
        <Toolbar disableGutters>
          {/*Title/Logo Section*/}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-start",
              pl: 2,
            }}
          >
          <Box component='img' alt='WellAI Logo' src={logo}
            onClick={() => navigate("/user-landing")}
            sx={{height: 50, cursor: "pointer"}}
          />
          </Box>
          {/*Account Settings Section  */}
          <Box sx={{ flexGrow: 0 }}>
            <Button color="inherit">
              <AccountCircleIcon
                fontSize="large"
                onClick={handleOpenSettings}
                sx={{ p: 0, color: "#383838" }}
              ></AccountCircleIcon>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={openMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(openMenu)}
                onClose={handleCloseSettings}
              >
                {settings.map((page) => (
                  <MenuItem
                    key={page.title}
                    onClick={() => handleNavigate(page.title)}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {page.icon}
                    <Typography>{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Nav options relocated here. */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          borderRgiht: "2px solid #e9e9e9",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            top: "66px",
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            height: "770px",
          }}
          >
          <Typography color="#A9A9A9" sx={{ fontSize: 12, px: 3, py: 1, mt: 5 }}>
            Overview
          </Typography>
          <List>
            {merchantPages.map((page) => (
              <ListItemButton
                key={page.title}
                sx={{
                  color: selectedPage === page.title ? "#fff" : "383838",
                  backgroundColor: selectedPage === page.title ? "#417638" : "transparent",
                  borderRadius: "10px",
                  ml: 2,
                  mr: 2,
                  mb: 1,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: selectedPage === page.title ? "#417638" : "",
                  }
                }}
                onClick={() => handleNavigate(page.title)}
              >
                {page.icon} <ListItemText primary={page.title} sx={{ ml: 3 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            borderTop: "2px solid #e9e9e9",
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography color="#A9A9A9" sx={{ fontSize: 12 }}>
            © 2024 WellAI. All rights reserved.
          </Typography>
        </Box>
      </Drawer>
    </>
    );

  // Navigation Bar for admin user type
  if (role === "admin")
    return (
          <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          borderBottom: "2px solid #e9e9e9",
        }}
      >
        <Toolbar disableGutters>
          {/*Title/Logo Section*/}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-start",
              pl: 2,
            }}
          >
          <Box component='img' alt='WellAI Logo' src={logo}
            onClick={() => navigate("/admin-dashboard")}
            sx={{height: 50, cursor: "pointer"}}
          />
          </Box>
          {/*Account Settings Section  */}
          <Box sx={{ flexGrow: 0 }}>
            <Button color="inherit">
              <AccountCircleIcon
                fontSize="large"
                onClick={handleOpenSettings}
                sx={{ p: 0, color: "#383838" }}
              ></AccountCircleIcon>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={openMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(openMenu)}
                onClose={handleCloseSettings}
              >
                {settings.map((page) => (
                  <MenuItem
                    key={page.title}
                    onClick={() => handleNavigate(page.title)}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {page.icon}
                    <Typography>{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Nav options relocated here. */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          borderRgiht: "2px solid #e9e9e9",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            top: "66px",
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            height: "770px",
          }}
          >
          <Typography color="#A9A9A9" sx={{ fontSize: 12, px: 3, py: 1, mt: 5 }}>
            Overview
          </Typography>
          <List>
            {adminPages.map((page) => (
              <ListItemButton
                key={page.title}
                sx={{
                  color: selectedPage === page.title ? "#fff" : "383838",
                  backgroundColor: selectedPage === page.title ? "#417638" : "transparent",
                  borderRadius: "10px",
                  ml: 2,
                  mr: 2,
                  mb: 1,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: selectedPage === page.title ? "#417638" : "",
                  }
                }}
                onClick={() => handleNavigate(page.title)}
              >
                {page.icon} <ListItemText primary={page.title} sx={{ ml: 3 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            borderTop: "2px solid #e9e9e9",
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography color="#A9A9A9" sx={{ fontSize: 12 }}>
            © 2024 WellAI. All rights reserved.
          </Typography>
        </Box>
      </Drawer>
    </>
    );
};
export default NavBar;
