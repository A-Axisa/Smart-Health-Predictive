import { useState } from 'react';
import { TextField , Select, MenuItem, FormControl, InputLabel, Grid, 
         Box} from '@mui/material';
import { getCountries, parsePhoneNumberFromString} from 'libphonenumber-js';

/**
 * An input field that provides basic validation for phone numbers and a
 * selection for the country code.
 * 
 * @param {Object} props
 * @param {function} [props.onChange] - Callback function called when input 
 *   is changed.
 */
const PhoneInputField = ({ onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isValid, setIsValid] = useState(true);

  function getCountryDropdownOptions() {
    return getCountries().map((country) => (
      <MenuItem key={country} value={country}>{country}</MenuItem>
    ));
  }

  function updateSelection(e) {
    setSelectedCountry(e.target.value);
  }

  function validate_input(e) {
    if(e.target.value !== ''){
      const parsedNumber = parsePhoneNumberFromString(
        e.target.value, selectedCountry);
      const isInputValid = parsedNumber!==undefined && 
        parsedNumber.isValid();
      const phoneNumber = isInputValid ? parsedNumber.number : null;
      setIsValid(isInputValid);
      onChange?.({
        'phone':phoneNumber,
        'isValid':isInputValid,
      });

    } else {
      setIsValid(true); // Empty phone numbers are valid.
      onChange?.({
        'phone':'',
        'isValid':true,
      });
    }
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <Grid container spacing={2}>
        <Grid size={5}>
          <FormControl sx={{width:'100%'}} >
            <InputLabel id="demo-simple-select-label">
              Country Code
            </InputLabel>
            <Select 
              labelId='country_select_label' 
              id='country_select' 
              label='Country Code'
              value={selectedCountry}
              onChange={updateSelection}>
              {getCountryDropdownOptions()}
            </Select>
          </FormControl> 
        </Grid>
        <Grid size={7}>
          <TextField error={!isValid} id='outlined-input' name='phone' 
            label='Phone' onChange={validate_input} 
            sx={{width:'100%'}}>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PhoneInputField;
