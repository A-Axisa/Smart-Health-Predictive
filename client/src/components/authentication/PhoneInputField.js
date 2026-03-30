import { useState } from 'react';
import { TextField, FormControl, Grid, 
         Box, Autocomplete} from '@mui/material';
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
    return getUniqueDialingCodes().map((code) => ({label: "+" + code, code: code}));
  }

  /**
   * Creates an array containing all unique dialing codes.
   * @returns Array of possible dialing codes.
   */
  function getUniqueDialingCodes() {
    return Array.from(new Set(getCountries().map((country) => (
      getCountryCallingCode(country))).sort((a, b) => a - b)));
  }

  function updateSelection(_, value) {
    if(value !== null) {
      value = value.code
    }
    setSelectedDialingCode(value)
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
            <Autocomplete
              options={getDialingCodeDropdownOptions()}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Dialing Code" />}
              onChange={updateSelection} 
            />
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
