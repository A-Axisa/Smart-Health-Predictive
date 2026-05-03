import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import logo from "../assets/WellAiLogoTR.png";
import { Drawer, List, ListItemButton, ListItemText, IconButton, Tooltip } from "@mui/material";
import { UserContext } from "../utils/UserContext";
import PrivacyNotice from "./PrivacyNotice";
import DisclaimerPolicy from "./DisclaimerPolicy";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import TimelineIcon from "@mui/icons-material/Timeline";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";


const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const NavBar = ({ role }) => {

  // Maps each route to the corrosponding page title.
  const routePageMap = {

    // User Pages
    "/user-landing": "Dashboard",
    "/generate-report": "Generate Report",
    "/ai-health-prediction": "Report History",
    "/health-analytics": "Health Analytics",
    "/user-settings": "Settings",

    // Merchant Pages
    "/merchant-landing": "Dashboard",
    "/merchant-generate-report": "Generate Report",
    "/merchant-reports": "Report History",
    "/patient-management": "Patient Management",
    "/create-patient": "Patient Management",

    // Admin Pages
    "/admin-dashboard": "Dashboard",
    "/admin-users": "Users",
    "/admin-account-approval": "Account Requests",
    "/admin-audit-logs": "Audit Logs",
  };

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const selectedPage = routePageMap[location.pathname] ?? null;
  const [isOpen, setIsOpen] = useState(true);
  const [privacyNoticeOpen, setPrivacyNoticeOpen] = useState(false);
  const [disclaimerPolicyOpen, setDisclaimerPolicyOpen] = useState(false);

  // Page options for each user type
  const standardUserPages = [
    { icon: <DashboardIcon />, title: "Dashboard" },
    { icon: <RestorePageIcon />, title: "Generate Report" },
    { icon: <HistoryIcon />, title: "Report History" },
    { icon: <TimelineIcon />, title: "Health Analytics" },
  ];

  const merchantPages = [
    { icon: <DashboardIcon />, title: "Dashboard" },
    { icon: <RestorePageIcon />, title: "Generate Report" },
    { icon: <HistoryIcon />, title: "Report History" },
    { icon: <ManageAccountsIcon />, title: "Patient Management" },
  ];

  const adminPages = [
    { icon: <DashboardIcon />, title: "Dashboard" },
    { icon: <GroupIcon />, title: "Users" },
    { icon: <HowToRegIcon />, title: "Account Requests" },
    { icon: <FileCopyIcon />, title: "Audit Logs" },
  ];

  const userAccountPages = [
    { icon: <SettingsIcon sx={{ colo: "#383838" }} />, title: "Settings" },
    { icon: <LogoutIcon sx={{ color: "#ff4f4f" }} />, title: "Logout" },
  ];

  const merchantAccountPages = [
    { icon: <LogoutIcon sx={{ color: "#ff4f4f" }} />, title: "Logout" },
  ];

  const adminAccountPages = [
    { icon: <LogoutIcon sx={{ color: "#ff4f4f" }} />, title: "Logout" },
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
    if (page === "Dashboard") {
      if (role === "standard_user") {
        navigate("/user-landing");
      }
      if (role === "merchant") {
        navigate("/merchant-landing");
      }
      if (role === "admin") {
        navigate("/admin-dashboard");
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
    if (page === "Settings") {
      handleCloseSettings();
      navigate("/user-settings");
    }
    if (page === "Logout") {
      handleCloseSettings();
      logout();
    }
    if (page === "Users") {
      if (role === "admin") {
        navigate("/admin-users");
      }
    }
    if (page === "Account Requests") {
      if (role === "admin") {
        navigate("/admin-account-approval");
      }
    }
    if (page === "Audit Logs") {
      if (role === "admin") {
        navigate("/admin-audit-logs");
      }
    }
    if (page === "Patient Management") {
      navigate("/patient-management");
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
              <Box
                component="img"
                alt="WellAI Logo"
                src={logo}
                onClick={() => navigate("/user-landing")}
                sx={{ height: 50, cursor: "pointer" }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Nav Options */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: isOpen ? 250 : 65,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isOpen ? 250 : 65,
              top: "66px",
              overflowX: "hidden",
              transition: "width 0.2s ease",
            },
          }}
        >
          <Box
            sx={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: isOpen ? "flex-end" : "center",
                px: 1,
                pt: 2,
                pb: 1
              }}
            >
              <IconButton onClick={() => setIsOpen(!isOpen)} size="small">
                {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Box>

            {isOpen && (
              <Typography
                sx={{ fontSize: 12, px: 3, color: "#A9A9A9" }}
              >
                Overview
              </Typography>
            )}

            <List>
              {standardUserPages.map((page) => (
                <Tooltip key={page.title} title={!isOpen ? page.title : ""} placement="right">
                  <ListItemButton
                    key={page.title}
                    sx={{
                      color: selectedPage === page.title ? "#fff" : "383838",
                      backgroundColor:selectedPage === page.title ? "#712b89" : "transparent",
                      mb: 1,
                      px: 3,
                      py: 1.5,
                      justifyContent: isOpen ? "initial" : "center",
                      "&:hover": {
                        backgroundColor: selectedPage === page.title ? "#712b89" : "",
                      },
                    }}
                    onClick={() => handleNavigate(page.title)}
                  >
                    {page.icon}
                    {isOpen && (
                      <Typography variant="h7"
                        sx={{ ml: 3 }}>
                        {page.title}
                      </Typography>
                    )}
                  </ListItemButton>
                </Tooltip>
              ))}
            </List>

            <Box
              sx={{
                mt: "auto",
                mb: 8,
              }}
            >
              {/* Account Options */}
              {isOpen && (
                <Typography
                  sx={{ fontSize: 12, px: 3, color: "#A9A9A9" }}
                >
                  Account
                </Typography>
              )}
              <List>
                {userAccountPages.map((page) => (
                  <Tooltip key={page.title} title={!isOpen ? page.title : ""} placement="right">
                    <ListItemButton
                      key={page.title}
                      sx={{
                        color: selectedPage === page.title ? "#fff" : "383838",
                        backgroundColor:selectedPage === page.title ? "#712b89" : "transparent",
                        mb: 1,
                        px: 3,
                        py: 1.5,
                        justifyContent: isOpen ? "initial" : "center",
                        "&:hover": {
                          backgroundColor: selectedPage === page.title ? "#712b89" : "",
                        },
                      }}
                      onClick={() => handleNavigate(page.title)}
                    >
                      {page.icon}
                      {isOpen && (
                        <Typography variant="h7"
                          sx={{ ml: 3 }}>
                          {page.title}
                        </Typography>
                      )}
                    </ListItemButton>
                  </Tooltip>
                ))}
              </List>
              <Box
                sx={{
                  borderTop: "2px solid #e9e9e9",
                  py: 3,
                  textAlign: "center",
                }}
              >
                {/* Footer */}
                {isOpen && (
                  <>
                    <Typography color="#A9A9A9" sx={{ fontSize: 12 }}>
                      © 2024 WellAI. All rights reserved.{" "}

                      <Box component="span" onClick={() => setPrivacyNoticeOpen(true)} sx={{ cursor: "pointer" }}>
                        <b><u>Privacy Notice</u></b>
                      </Box> &{" "}

                      <Box component="span" onClick={() => setDisclaimerPolicyOpen(true)} sx={{ cursor: "pointer" }}>
                        <b><u>Disclaimer Policy</u></b>
                      </Box>.

                    </Typography>
                    <PrivacyNotice open={privacyNoticeOpen} onClose={() => setPrivacyNoticeOpen(false)} />
                    <DisclaimerPolicy open={disclaimerPolicyOpen} onClose={() => setDisclaimerPolicyOpen(false)} />
                  </>
                )}
              </Box>
            </Box>
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
              <Box
                component="img"
                alt="WellAI Logo"
                src={logo}
                onClick={() => navigate("/merchant-landing")}
                sx={{ height: 50, cursor: "pointer" }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Nav Options */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: isOpen ? 250 : 65,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isOpen ? 250 : 65,
              top: "66px",
              overflowX: "hidden",
              transition: "width 0.2s ease",
            },
          }}
        >
          <Box
            sx={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: isOpen ? "flex-end" : "center",
                px: 1,
                pt: 2,
                pb: 1
              }}
            >
              <IconButton onClick={() => setIsOpen(!isOpen)} size="small">
                {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Box>

            {isOpen && (
              <Typography
                sx={{ fontSize: 12, px: 3, color: "#A9A9A9" }}
              >
                Overview
              </Typography>
            )}

            <List>
              {merchantPages.map((page) => (
                <Tooltip key={page.title} title={!isOpen ? page.title : ""} placement="right">
                  <ListItemButton
                    key={page.title}
                    sx={{
                      color: selectedPage === page.title ? "#fff" : "383838",
                      backgroundColor:selectedPage === page.title ? "#417638" : "transparent",
                      mb: 1,
                      px: 3,
                      py: 1.5,
                      justifyContent: isOpen ? "initial" : "center",
                      "&:hover": {
                        backgroundColor: selectedPage === page.title ? "#417638" : "",
                      },
                    }}
                    onClick={() => handleNavigate(page.title)}
                  >
                    {page.icon}
                    {isOpen && (
                      <Typography variant="h7"
                        sx={{ ml: 3 }}>
                        {page.title}
                      </Typography>
                    )}
                  </ListItemButton>
                </Tooltip>
              ))}
            </List>

            <Box
              sx={{
                mt: "auto",
                mb: 8,
              }}
            >
              {/* Account Options */}
              {isOpen && (
                <Typography
                  sx={{ fontSize: 12, px: 3, color: "#A9A9A9" }}
                >
                  Account
                </Typography>
              )}
              <List>
                {merchantAccountPages.map((page) => (
                  <Tooltip key={page.title} title={!isOpen ? page.title : ""} placement="right">
                    <ListItemButton
                      key={page.title}
                      sx={{
                        color: selectedPage === page.title ? "#fff" : "383838",
                        backgroundColor:selectedPage === page.title ? "#417638" : "transparent",
                        mb: 1,
                        px: 3,
                        py: 1.5,
                        justifyContent: isOpen ? "initial" : "center",
                        "&:hover": {
                          backgroundColor: selectedPage === page.title ? "#417638" : "",
                        },
                      }}
                      onClick={() => handleNavigate(page.title)}
                    >
                      {page.icon}
                      {isOpen && (
                        <Typography variant="h7"
                          sx={{ ml: 3 }}>
                          {page.title}
                        </Typography>
                      )}
                    </ListItemButton>
                  </Tooltip>
                ))}
              </List>
              <Box
                sx={{
                  borderTop: "2px solid #e9e9e9",
                  py: 3,
                  textAlign: "center",
                }}
              >
                {/* Footer */}
                {isOpen && (
                  <>
                    <Typography color="#A9A9A9" sx={{ fontSize: 12 }}>
                      © 2024 WellAI. All rights reserved.{" "}

                      <Box component="span" onClick={() => setPrivacyNoticeOpen(true)} sx={{ cursor: "pointer" }}>
                        <b><u>Privacy Notice</u></b>
                      </Box> &{" "}

                      <Box component="span" onClick={() => setDisclaimerPolicyOpen(true)} sx={{ cursor: "pointer" }}>
                        <b><u>Disclaimer Policy</u></b>
                      </Box>.

                    </Typography>
                    <PrivacyNotice open={privacyNoticeOpen} onClose={() => setPrivacyNoticeOpen(false)} />
                    <DisclaimerPolicy open={disclaimerPolicyOpen} onClose={() => setDisclaimerPolicyOpen(false)} />
                  </>
                )}
              </Box>
            </Box>
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
              <Box
                component="img"
                alt="WellAI Logo"
                src={logo}
                onClick={() => navigate("/admin-dashboard")}
                sx={{ height: 50, cursor: "pointer" }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Nav Options */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: isOpen ? 250 : 65,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isOpen ? 250 : 65,
              top: "66px",
              overflowX: "hidden",
              transition: "width 0.2s ease",
            },
          }}
        >
          <Box
            sx={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: isOpen ? "flex-end" : "center",
                px: 1,
                pt: 2,
                pb: 1
              }}
            >
              <IconButton onClick={() => setIsOpen(!isOpen)} size="small">
                {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Box>

            {isOpen && (
              <Typography
                sx={{ fontSize: 12, px: 3, color: "#A9A9A9" }}
              >
                Overview
              </Typography>
            )}

            <List>
              {adminPages.map((page) => (
                <Tooltip key={page.title} title={!isOpen ? page.title : ""} placement="right">
                  <ListItemButton
                    key={page.title}
                    sx={{
                      color: selectedPage === page.title ? "#fff" : "383838",
                      backgroundColor:selectedPage === page.title ? "#417638" : "transparent",
                      mb: 1,
                      px: 3,
                      py: 1.5,
                      justifyContent: isOpen ? "initial" : "center",
                      "&:hover": {
                        backgroundColor: selectedPage === page.title ? "#417638" : "",
                      },
                    }}
                    onClick={() => handleNavigate(page.title)}
                  >
                    {page.icon}
                    {isOpen && (
                      <Typography variant="h7"
                        sx={{ ml: 3 }}>
                        {page.title}
                      </Typography>
                    )}
                  </ListItemButton>
                </Tooltip>
              ))}
            </List>

            <Box
              sx={{
                mt: "auto",
                mb: 8,
              }}
            >
              {/* Account Options */}
              {isOpen && (
                <Typography
                  sx={{ fontSize: 12, px: 3, color: "#A9A9A9" }}
                >
                  Account
                </Typography>
              )}
              <List>
                {adminAccountPages.map((page) => (
                  <Tooltip key={page.title} title={!isOpen ? page.title : ""} placement="right">
                    <ListItemButton
                      key={page.title}
                      sx={{
                        color: selectedPage === page.title ? "#fff" : "383838",
                        backgroundColor:selectedPage === page.title ? "#417638" : "transparent",
                        mb: 1,
                        px: 3,
                        py: 1.5,
                        justifyContent: isOpen ? "initial" : "center",
                        "&:hover": {
                          backgroundColor: selectedPage === page.title ? "#417638" : "",
                        },
                      }}
                      onClick={() => handleNavigate(page.title)}
                    >
                      {page.icon}
                      {isOpen && (
                        <Typography variant="h7"
                          sx={{ ml: 3 }}>
                          {page.title}
                        </Typography>
                      )}
                    </ListItemButton>
                  </Tooltip>
                ))}
              </List>
              <Box
                sx={{
                  borderTop: "2px solid #e9e9e9",
                  py: 3,
                  textAlign: "center",
                }}
              >
                {/* Footer */}
                {isOpen && (
                  <>
                    <Typography color="#A9A9A9" sx={{ fontSize: 12 }}>
                      © 2024 WellAI. All rights reserved.{" "}

                      <Box component="span" onClick={() => setPrivacyNoticeOpen(true)} sx={{ cursor: "pointer" }}>
                        <b><u>Privacy Notice</u></b>
                      </Box> &{" "}

                      <Box component="span" onClick={() => setDisclaimerPolicyOpen(true)} sx={{ cursor: "pointer" }}>
                        <b><u>Disclaimer Policy</u></b>
                      </Box>.

                    </Typography>
                    <PrivacyNotice open={privacyNoticeOpen} onClose={() => setPrivacyNoticeOpen(false)} />
                    <DisclaimerPolicy open={disclaimerPolicyOpen} onClose={() => setDisclaimerPolicyOpen(false)} />
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Drawer>
      </>
    );
};
export default NavBar;
