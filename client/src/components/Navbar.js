import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const NavBar = ({ role }) => {
  const navigate = useNavigate();
  // Page options for each user type
  const standardPages = [
    "Generate Report",
    "Health History",
    "Health Analytics",
  ];
  const settings = ["Account", "Logout"];
  const merchantPages = ["Page"];
  const adminPages = ["Page"];
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
        navigate("/login");
      });
  }

  // Handle navigation for each page option
  function handleNavigate(page) {
    if (page === "Generate Report") {
      navigate("/generate-report");
    }
    if (page === "Health History") {
      navigate("/ai-health-prediction");
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
      <AppBar position="static">
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
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => navigate("/user-landing")}
              sx={{
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Smart Health Predictive
            </Typography>
          </Box>
          {/*Page Options  */}
          <Box sx={{ display: "flex", alignItems: "center", mx: 1 }}>
            {standardPages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigate(page)}
                sx={{ my: 2, color: "inherit", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/*Account Settings Section  */}
          <Box sx={{ flexGrow: 0 }}>
            <Button color="inherit">
              <AccountCircleIcon
                fontSize="large"
                onClick={handleOpenSettings}
                sx={{ p: 0 }}
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
                  <MenuItem key={page} onClick={() => handleNavigate(page)}>
                    <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );

  // Navigation Bar for merchant user type
  if (role === "merchant") return <h1>Hello Merchant</h1>;
  // Navigation Bar for admin user type
  if (role === "admin") return <h1>Hello Admin</h1>;
};

export default NavBar;
