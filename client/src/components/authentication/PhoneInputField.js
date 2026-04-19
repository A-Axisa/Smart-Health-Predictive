import { useState } from "react";
import { TextField, FormControl, Grid, Box, Autocomplete } from "@mui/material";
import {
  getCountries,
  parsePhoneNumberFromString,
  getCountryCallingCode,
} from "libphonenumber-js";

/**
 * An input field that provides basic validation for phone numbers and a
 * selection for a dialling code.
 *
 * @param {Object} props
 * @param {function} [props.onChange] - Callback function called when input
 *   is changed.
 */
const PhoneInputField = ({ onChange }) => {
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");
  const [selectedDialingCode, setSelectedDialingCode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isValidDialingCode, setIsValidDialingCode] = useState(true);

  function getDialingCodeDropdownOptions() {
    return getCountryPhoneDetails().map((country) => ({
      label: country["name"] + ": +" + country["dialingCode"],
      code: country["dialingCode"],
    }));
  }

  /**
   * Returns an array of dictionaries containing countries names and their
   * dialing codes.
   * @returns Array of dictionaries for countries dialing codes.
   */
  function getCountryPhoneDetails() {
    const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
    return getCountries()
      .map((country) => ({
        name: countryNames.of(country),
        countryCode: country,
        dialingCode: getCountryCallingCode(country),
      }))
      .sort((a, b) => a - b);
  }

  /**
   * Creates an array containing all unique dialing codes.
   * @returns Array of possible dialing codes.
   */
  function getUniqueDialingCodes() {
    return Array.from(
      new Set(
        getCountries()
          .map((country) => getCountryCallingCode(country))
          .sort((a, b) => a - b),
      ),
    );
  }

  function updateDialingCode(_, value) {
    if (value !== null) {
      value = value.code;
    }
    setSelectedDialingCode(value);
    outputPhoneNumber(rawPhoneNumber, value);
  }

  function updatePhoneNumber(e) {
    const phoneNumber = e.target.value;
    setRawPhoneNumber(phoneNumber);
    outputPhoneNumber(phoneNumber, selectedDialingCode);
  }

  function outputPhoneNumber(phoneNumber, dialingCode) {
    if (isPhoneValid(phoneNumber, dialingCode)) {
      const parsedNumber = parsePhoneNumberFromString(phoneNumber, {
        defaultCallingCode: dialingCode,
      });
      const outputPhoneNumber = phoneNumber !== "" ? parsedNumber.number : "";
      setIsValid(true);
      setIsValidDialingCode(true);
      onChange?.({
        phone: outputPhoneNumber,
        isValid: true,
      });
    } else {
      setIsValid(false);
      setIsValidDialingCode(!!dialingCode);
      onChange?.({
        phone: null,
        isValid: false,
      });
    }
  }

  function isPhoneValid(phoneNumber, dialingCode) {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber, {
      defaultCallingCode: dialingCode,
    });
    return (
      phoneNumber === "" ||
      (parsedNumber !== undefined && parsedNumber.isValid() && !!dialingCode)
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={7}>
          <FormControl sx={{ width: "100%" }}>
            <Autocomplete
              options={getDialingCodeDropdownOptions()}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dialing Code"
                  error={!isValidDialingCode}
                />
              )}
              onChange={updateDialingCode}
            />
          </FormControl>
        </Grid>
        <Grid size={5}>
          <TextField
            error={!isValid}
            id="outlined-input"
            name="phone"
            label="Phone"
            onChange={updatePhoneNumber}
            sx={{ width: "100%" }}
          ></TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PhoneInputField;
