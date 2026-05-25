import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, Button, MenuItem, Select } from "@mui/material";

/**
 * A tool bar to that provides the controls for modifying and filtering user
 * data including deletion, role changing, and clinic filtering. This
 * component is designed to be used with the UserManagementTable.
 *
 * @param {Object} props
 * @param {Object} [props.rowSelectionModel]
 * @param {string} [props.rowSelectionModel.type] - "include" or "exclude" selection.
 * @param {Set} [props.rowSelectionModel.ids] - User ID's that are selected
 * @param {int} [props.totalRowCount] - Number of rows when selection type is "exclude"
 * @param {function} [props.onUsersDelete] - Callback function for deleting user
 * @param {function} [props.onUsersRoleChange] - Callback function for changing user role
 * @param {function} [props.onClinicChange] - Callback function for changing clinic
 * @param {Object} [props.roleData] - A list of all roles in the system and their ID
 * @param {Object} [props.clinicData] - A list of all clinics in the system and their ID
 * @param {int} [props.selectedClinic] - ID of the selected clinic
 * @returns {@mui.material.Box}
 */
const UserToolBar = ({
  rowSelectionModel,
  totalRowCount,
  onUsersDelete,
  onUsersRoleChange,
  onClinicChange,
  roleData,
  clinicData,
  selectedClinic,
}) => {
  // Return row count instead of set size.
  const getEmailCount = () => {
    if (rowSelectionModel?.type === "exclude") return totalRowCount;
    if (rowSelectionModel?.ids instanceof Set)
      return rowSelectionModel.ids.size;
    if (Array.isArray(rowSelectionModel)) return rowSelectionModel.length;
    return 0;
  };

  const emailCount = getEmailCount();

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 1,
        justifyContent: { xs: "flex-end" },
      }}
    >
      <Select
        size="small"
        displayEmpty
        value={selectedClinic}
        onChange={(e) => onClinicChange(e.target.value)}
        sx={{
          width: { xs: "100%", sm: 200 },
        }}
      >
        <MenuItem value="">All Clinics</MenuItem>
        {clinicData.map((clinic) => (
          <MenuItem key={clinic.id} value={clinic.id}>
            {clinic.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        size="small"
        displayEmpty
        disabled={emailCount === 0}
        value=""
        onChange={(e) => onUsersRoleChange(e.target.value)}
        sx={{
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <MenuItem value="" disabled>
          Change Role...
        </MenuItem>
        {roleData.map((role) => (
          <MenuItem key={role.id} value={role.id}>
            {role.name}
          </MenuItem>
        ))}
      </Select>
      <Button
        size="small"
        color="error"
        variant="contained"
        disabled={emailCount === 0}
        onClick={onUsersDelete}
        sx={{
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <DeleteForeverIcon /> Delete Selected
      </Button>
    </Box>
  );
};

export default UserToolBar;
