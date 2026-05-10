import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment, Box } from "@mui/material";
import { memo, useEffect, useState } from "react";

const AuditLogSearchBar = ({ onSearchChange, delay = 500 }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value.trim());
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, onSearchChange, delay]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 2, mr: 2 }}>
      <TextField
        label="Search by Email"
        variant="outlined"
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ width: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default memo(AuditLogSearchBar);
