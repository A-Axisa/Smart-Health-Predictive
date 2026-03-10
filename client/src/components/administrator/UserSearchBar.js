import SearchIcon from '@mui/icons-material/Search'
import Input from '@mui/material/Input'

const UserSearchBar = ({ placeholder, onChange }) => {
  return (
    <div>
      <SearchIcon />
      <Input
        placeholder={placeholder}
        onChange={onChange}
        fullWidth
      />
    </div>
  );
}

export default UserSearchBar;