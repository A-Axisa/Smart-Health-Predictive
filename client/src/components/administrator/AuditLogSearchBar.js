import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment, Box } from "@mui/material";
import { memo, useEffect, useState } from "react";

const AuditLogSearchBar = ({ onSearchChange, delay = 500, placeholder }) => {
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
    <Box sx={{ display: "flex", alignItems: "center", mx: 1, flex: 1 }}>
      <TextField
        variant="standard"
        size="small"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        fullwidth
        sx={{ py: 2 }}
        InputProps={{
          disableUnderline: true,
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
