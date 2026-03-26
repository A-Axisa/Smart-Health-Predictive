import { useState } from 'react';
import { TextField , Select, MenuItem, FormControl, InputLabel, Grid, 
         Box} from '@mui/material';
import { getCountries, parsePhoneNumberFromString, 
         getCountryCallingCode } from 'libphonenumber-js';

/**
 * An input field that provides basic validation for phone numbers and a
 * selection for a dialling code.
 * 
 * @param {Object} props
 * @param {function} [props.onChange] - Callback function called when input 
 *   is changed.
 */
const PhoneInputField = ({ onChange }) => {
  const [selectedDialingCode, setSelectedDialingCode] = useState('');
  const [isValid, setIsValid] = useState(true);

  function getDialingCodeDropdownOptions() {
    return getUniqueDialingCodes().map((code) => (
      <MenuItem key={code} value={code}>{'+' + code}</MenuItem>
    ));
  }

  /**
   * Creates an array containing all unique dialing codes.
   * @returns Array of possible dialing codes.
   */
  function getUniqueDialingCodes() {
    return Array.from(new Set(getCountries().map((country) => (
      Number(getCountryCallingCode(country)))).sort((a, b) => a - b)));
  }

  function updateSelection(e) {
    setSelectedDialingCode(e.target.value);
  }

  function validate_input(e) {
    if(e.target.value !== ''){
      const parsedNumber = parsePhoneNumberFromString(
        e.target.value, { defaultCallingCode: selectedDialingCode });
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
              Dialing Code
            </InputLabel>
            <Select 
              labelId='dialing_select_label' 
              id='dialing_select' 
              label='Dialing Code'
              value={selectedDialingCode}
              onChange={updateSelection}>
              {getDialingCodeDropdownOptions()}
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
