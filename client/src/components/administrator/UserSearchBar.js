import SearchIcon from "@mui/icons-material/Search";
import { Input, Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState, memo } from "react";

const UserSearchBar = ({ placeholder, onSearchChange, delay = 400 }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(inputValue.trim());
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [inputValue, onSearchChange, delay]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Input
        sx={{ py: 2 }}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default memo(UserSearchBar);
