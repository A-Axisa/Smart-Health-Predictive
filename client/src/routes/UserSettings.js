import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Divider,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from "@mui/material";
import ConfirmationDialog from "../components/confirmationDialog";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

const UserSettings = () => {
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    updateUserFields,
    refreshUser,
  } = useContext(UserContext);
  const [selectedSection, setSelectedSection] = useState("Account Details");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Account/Profile state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    height: "", // cm
    weight: "", // kg
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordChanged, setPasswordChanged] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    healthReminders: true,
    reportUpdates: true,
    systemAlerts: false,
  });

  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [profileErrors, setProfileErrors] = useState({});
  const [accountSaving, setAccountSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Resolve API base from environment variable
  const API_BASE = useMemo(
    () => process.env.REACT_APP_API_URL || "http://localhost:8000",
    [],
  );

  const isUserLoggedIn = Boolean(user) && !userLoading;

  // Initialize form from UserContext
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      email: user.email || "",
      phone: user.phone_number || "",
      firstName: user.given_names || "",
      lastName: user.family_name || "",
      gender:
        user.gender === null || user.gender === undefined
          ? ""
          : String(user.gender),
      dateOfBirth: user.date_of_birth || "",
      height: user.height ?? "",
      weight: user.weight ?? "",
    }));
  }, [user]);

  const clearMessages = () => {
    setSaveMessage("");
    setSaveError("");
  };

  const patchSettings = async (endpoint, payload) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const body = await response.json();
        message = body?.detail || body?.message || message;
      } catch (_) {
        const text = await response.text();
        if (text) message = text;
      }
      throw new Error(message);
    }
    return response.json();
  };

  function handleChangePassword() {
    setPasswordChanged(false);
    fetch(`${API_BASE}/change-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_new_password: passwordData.confirmPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        setPasswordChanged(true);
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const updateForm = (k, v) => setFormData((p) => ({ ...p, [k]: v }));
  const updatePwd = (k, v) => setPasswordData((p) => ({ ...p, [k]: v }));
  const updateNotify = (k, v) => setNotifications((p) => ({ ...p, [k]: v }));

  const handleSave = (section) => {
    setSaveMessage(`${section} saved successfully!`);
    setTimeout(() => setSaveMessage(""), 2500);
  };

  const validateProfile = () => {
    const errors = {};
    const height = formData.height === "" ? null : Number(formData.height);
    const weight = formData.weight === "" ? null : Number(formData.weight);
    if (
      height !== null &&
      (Number.isNaN(height) || height < 90 || height > 250)
    ) {
      errors.height = "Height must be between 90 and 250 cm";
    }
    if (
      weight !== null &&
      (Number.isNaN(weight) || weight < 20 || weight > 300)
    ) {
      errors.weight = "Weight must be between 20 and 300 kg";
    }
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (Number.isNaN(dob.getTime()) || dob > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }
    if (
      formData.gender !== "" &&
      !["0", "1"].includes(String(formData.gender))
    ) {
      errors.gender = "Gender must be Female or Male";
    }
    if (formData.firstName && formData.firstName.length > 255) {
      errors.firstName = "First name is too long";
    }
    if (formData.lastName && formData.lastName.length > 255) {
      errors.lastName = "Last name is too long";
    }
    return errors;
  };

  const handleAccountSave = async () => {
    clearMessages();
    setAccountSaving(true);
    try {
      const phone = formData.phone ?? "";
      await patchSettings("/users/me", { phone_number: phone });
      updateUserFields({ phone_number: phone });
      setSaveMessage("Account details saved successfully!");
      setTimeout(() => setSaveMessage(""), 2500);
    } catch (error) {
      setSaveError(error?.message || "Failed to save account details");
    } finally {
      setAccountSaving(false);
    }
  };

  const handleProfileSave = async () => {
    clearMessages();
    const errors = validateProfile();
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSaveError("Please fix profile validation errors before saving.");
      return;
    }

    setProfileSaving(true);
    try {
      const payload = {
        given_names: formData.firstName || null,
        family_name: formData.lastName || null,
        gender: formData.gender === "" ? null : Number(formData.gender),
        height: formData.height === "" ? null : Number(formData.height),
        weight: formData.weight === "" ? null : Number(formData.weight),
        date_of_birth: formData.dateOfBirth || null,
      };
      await patchSettings("/patients/me", payload);
      updateUserFields({
        given_names: formData.firstName || "",
        family_name: formData.lastName || "",
        gender: formData.gender === "" ? null : Number(formData.gender),
        height: formData.height === "" ? "" : Number(formData.height),
        weight: formData.weight === "" ? "" : Number(formData.weight),
        date_of_birth: formData.dateOfBirth || "",
      });
      setSaveMessage("Profile saved successfully!");
      setTimeout(() => setSaveMessage(""), 2500);
      refreshUser();
    } catch (error) {
      setSaveError(error?.message || "Failed to save profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const AccountDetails = () => (
    <Box>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
      >
        Account Details
      </Typography>
      {saveMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveMessage}
        </Alert>
      )}
      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          disabled
          helperText="Email update is currently not supported"
          fullWidth
        />
        <TextField
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => updateForm("phone", e.target.value)}
          helperText="Only digits will be stored"
          fullWidth
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            color="error"
            sx={{ fontWeight: 600 }}
          >
            Danger Zone
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 1, maxWidth: 500 }}>
              {deleteError}
            </Alert>
          )}
          <Button
            variant="contained"
            color="error"
            disabled={!isUserLoggedIn || deleteBusy}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              mt: 1,
              py: { xs: "0.8rem", sm: "0.6rem" },
              fontSize: { xs: "1rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            {deleteBusy ? "Deleting…" : "Delete My Account"}
          </Button>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="outlined"
            disabled={accountSaving}
            sx={{
              mr: 2,
              py: { xs: "0.8rem", sm: "0.6rem" },
              fontSize: { xs: "1rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
            onClick={() => {
              if (!user) return;
              setFormData((prev) => ({
                ...prev,
                phone: user.phone_number || "",
              }));
              clearMessages();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAccountSave}
            disabled={accountSaving || userLoading}
            sx={{
              px: 4,
              py: { xs: "0.8rem", sm: "0.6rem" },
              fontSize: { xs: "1rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            {accountSaving ? "Saving…" : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const Profile = () => (
    <Box>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
      >
        Profile Settings
      </Typography>
      {saveMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveMessage}
        </Alert>
      )}
      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">
          {user?.given_names || ""} {user?.family_name || ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || ""}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={(e) => updateForm("firstName", e.target.value)}
          error={Boolean(profileErrors.firstName)}
          helperText={profileErrors.firstName || ""}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => updateForm("lastName", e.target.value)}
          error={Boolean(profileErrors.lastName)}
          helperText={profileErrors.lastName || ""}
          fullWidth
        />
        <FormControl fullWidth error={Boolean(profileErrors.gender)}>
          <InputLabel>Gender</InputLabel>
          <Select
            variant="outlined"
            label="Gender"
            value={formData.gender}
            onChange={(e) => updateForm("gender", e.target.value)}
          >
            <MenuItem value="0">Female</MenuItem>
            <MenuItem value="1">Male</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateForm("dateOfBirth", e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          error={Boolean(profileErrors.dateOfBirth)}
          helperText={profileErrors.dateOfBirth || ""}
          fullWidth
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={formData.height}
          onChange={(e) => updateForm("height", e.target.value)}
          error={Boolean(profileErrors.height)}
          helperText={profileErrors.height || ""}
          fullWidth
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={formData.weight}
          onChange={(e) => updateForm("weight", e.target.value)}
          error={Boolean(profileErrors.weight)}
          helperText={profileErrors.weight || ""}
          fullWidth
          inputProps={{ min: 0 }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleProfileSave}
          disabled={profileSaving || userLoading}
          sx={{
            px: 4,
            py: { xs: "0.8rem", sm: "0.6rem" },
            fontSize: { xs: "1rem", sm: "0.875rem" },
            fontWeight: 500,
          }}
        >
          {profileSaving ? "Saving…" : "Save Profile"}
        </Button>
      </Box>
    </Box>
  );

  const Password = () => {
    const mismatch =
      passwordData.confirmPassword &&
      passwordData.newPassword !== passwordData.confirmPassword;
    const disabled =
      !passwordData.currentPassword || !passwordData.newPassword || mismatch;
    return (
      <Box>
        <Typography
          variant="h5"
          sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
        >
          Change Password
        </Typography>
        {saveMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {saveMessage}
          </Alert>
        )}

        <Stack spacing={3} sx={{ maxWidth: 600 }}>
          <TextField
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => updatePwd("currentPassword", e.target.value)}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => updatePwd("newPassword", e.target.value)}
            helperText="Password must be at least 15 characters"
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => updatePwd("confirmPassword", e.target.value)}
            error={Boolean(mismatch)}
            helperText={mismatch ? "Passwords don't match" : ""}
            fullWidth
          />
          <Typography variant="body2" color="text.secondary">
            Use at least 15 characters including upper/lowercase, numbers and
            symbols.
          </Typography>
          {passwordChanged && (
            <Typography variant="body2" color="success">
              Your password has been successfully changed!
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              disabled={disabled}
              onClick={() => handleChangePassword()}
              sx={{
                px: 4,
                py: { xs: "0.8rem", sm: "0.6rem" },
                fontSize: { xs: "1rem", sm: "0.875rem" },
                fontWeight: 500,
              }}
            >
              Update Password
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  };

  const Notifications = () => (
    <Box>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
      >
        Notification Settings
      </Typography>
      {saveMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveMessage}
        </Alert>
      )}

      <Stack spacing={1.5}>
        <FormControlLabel
          control={
            <Switch
              checked={notifications.emailNotifications}
              onChange={(e) =>
                updateNotify("emailNotifications", e.target.checked)
              }
            />
          }
          label="Email Notifications"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
          Receive reminders and updates via email
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifications.pushNotifications}
              onChange={(e) =>
                updateNotify("pushNotifications", e.target.checked)
              }
            />
          }
          label="Push Notifications"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
          Get instant notifications on your device
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifications.smsNotifications}
              onChange={(e) =>
                updateNotify("smsNotifications", e.target.checked)
              }
            />
          }
          label="SMS Notifications"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
          Receive important health alerts via SMS
        </Typography>

        <Divider sx={{ my: 2 }} />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.healthReminders}
              onChange={(e) =>
                updateNotify("healthReminders", e.target.checked)
              }
            />
          }
          label="Health Reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.reportUpdates}
              onChange={(e) => updateNotify("reportUpdates", e.target.checked)}
            />
          }
          label="Report Updates"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.systemAlerts}
              onChange={(e) => updateNotify("systemAlerts", e.target.checked)}
            />
          }
          label="System Alerts"
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            variant="contained"
            onClick={() => handleSave("Notifications")}
            sx={{
              px: 4,
              py: { xs: "0.8rem", sm: "0.6rem" },
              fontSize: { xs: "1rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            Save Preferences
          </Button>
        </Box>
      </Stack>
    </Box>
  );

  const handleTabChange = (event, newValue) => {
    setSelectedSection(newValue);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "Account Details":
        return AccountDetails();
      case "Profile":
        return Profile();
      case "Password":
        return Password();
      case "Notifications":
        return Notifications();
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        ml: "250px",
        mt: "66px",
      }}
    >
      {isMobile ? (
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "#ffffff",
            boxShadow: 1,
          }}
        >
          <Tabs
            value={selectedSection}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="user settings sections"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 500,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          >
            <Tab label="Account Details" value="Account Details" />
            <Tab label="Profile" value="Profile" />
            <Tab label="Password" value="Password" />
            <Tab label="Notifications" value="Notifications" />
          </Tabs>
        </Box>
      ) : (
        <Box
          sx={{
            width: 260,
            bgcolor: "#ffffff",
            borderRight: "1px solid #e0e0e0",
            boxShadow: 1,
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Settings
            </Typography>
          </Box>
          <List component="nav" sx={{ p: 0 }}>
            {["Account Details", "Profile", "Password", "Notifications"].map(
              (item) => (
                <ListItem
                  key={item}
                  button
                  selected={selectedSection === item}
                  onClick={() => setSelectedSection(item)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderLeft:
                      selectedSection === item
                        ? "4px solid"
                        : "4px solid transparent",
                    borderLeftColor: "primary.main",
                    bgcolor:
                      selectedSection === item
                        ? "action.selected"
                        : "transparent",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      fontWeight: selectedSection === item ? 600 : 400,
                    }}
                  />
                </ListItem>
              ),
            )}
          </List>
        </Box>
      )}

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {renderContent()}
        </Box>
      </Box>

      {/* Confirm deletion dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Account"
        message={
          <>
            This action will permanently delete your account and all associated
            data. This cannot be undone.
          </>
        }
        confirmText={deleteBusy ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        confirmColor="error"
        cancelColor="primary"
        confirm={async () => {
          if (!isUserLoggedIn) return;
          setDeleteBusy(true);
          setDeleteError("");
          try {
            const res = await fetch(`${API_BASE}/users/`, {
              method: "DELETE",
              credentials: "include",
            });
            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || `HTTP ${res.status}`);
            }
            // Best-effort logout to invalidate cookie on server
            try {
              await fetch(`${API_BASE}/logout`, {
                method: "POST",
                credentials: "include",
              });
            } catch (_) {}

            setDeleteDialogOpen(false);
            // Navigate to login
            navigate("/login");
          } catch (err) {
            setDeleteError(err?.message || "Failed to delete account");
          } finally {
            setDeleteBusy(false);
          }
        }}
        cancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default UserSettings;
