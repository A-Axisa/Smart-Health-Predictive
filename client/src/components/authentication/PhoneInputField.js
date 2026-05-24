import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { useState } from "react";

/**
 * An input field that provides basic validation for phone numbers and a
 * selection for a dialling code.
 *
 * @param {Object} props
 * @param {function} [props.onChange] - Callback function to call when input is changed.
 *                                      Event parameters: phone, isValid, and rawDigits
 * @param {String} [props.value] - Phone number
 */
const PhoneInputField = ({ onChange, value }) => {
  const [rawPhoneNumber, setRawPhoneNumber] = useState(
    value === null ? value : "",
  );
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
        rawDigits: phoneNumber,
      });
    } else {
      setIsValid(false);
      setIsValidDialingCode(!!dialingCode);
      onChange?.({
        phone: null,
        isValid: false,
        rawDigits: phoneNumber,
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
      }}
    >
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

      <TextField
        error={!isValid}
        id="outlined-input"
        name="phone"
        label="Phone"
        value={value}
        onChange={updatePhoneNumber}
        sx={{ width: "100%" }}
      />
    </Box>
  );
};

export default PhoneInputField;
