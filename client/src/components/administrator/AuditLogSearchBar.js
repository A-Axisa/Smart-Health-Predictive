import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@mui/material";
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
  );
};

export default memo(AuditLogSearchBar);
