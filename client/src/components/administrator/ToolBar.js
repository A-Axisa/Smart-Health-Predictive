import { Box, Select, Button, MenuItem } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const ToolBar = ({
  rowSelectionModel,
  totalRowCount,
  onUsersDelete,
  onUsersRoleChange,
  roleData,
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
        alignItems: "center",
        gap: 2,
        justifyContent: "flex-end",
      }}
    >
      <Select
        size="small"
        displayEmpty
        disabled={emailCount === 0}
        value=""
        onChange={(e) => onUsersRoleChange(e.target.value)}
        sx={{ minWidth: 150 }}
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
      >
        <DeleteForeverIcon /> Delete Selected
      </Button>
    </Box>
  );
};

export default ToolBar;
