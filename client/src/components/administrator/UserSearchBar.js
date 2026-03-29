import SearchIcon from '@mui/icons-material/Search'
import { Input, Box } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';

const UserSearchBar = ({ placeholder, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Input
        sx = {{ py: 2 }}
        placeholder={placeholder}
        onChange={onChange}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </Box>
  );
}

export default UserSearchBar;