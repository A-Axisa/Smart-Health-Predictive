import { useState } from 'react';
import { TextField } from '@mui/material';

/**
 * An input field that provides basic validation for an entered password. 
 * 
 * @param {Object} props
 * @param {function} [props.onChange] - Callback function called when input is changed.
 * @param {boolean} [props.restrictLength] - Display an error when password is 
 *   outside the suitable length.
 * @param {boolean} [props.truncate] - Truncate the password in the onChange callback.
 * @param {boolean} [props.showRequired] - Force the component to show the error state.
 */
const PasswordInputField = ({ onChange, restrictLength=true, truncate=false, 
  showRequired=false, requireCharacters=true, label='Password' }) => {
  
  const MIN_LENGTH = 14;
  const MAX_LENGTH = 65;
  const UPPERCASE_REGEX = /[A-Z]/
  const LOWERCASE_REGEX = /[a-z]/
  const NUMERICAL_REGEX = /[0-9]/
  const VALID_SYMBOLS = "~!@#$%^&*()_+[]{}|:;,.?/"
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isAltered, setIsAltered] = useState(false);

  async function updateState(e) {
    setIsAltered(true);

    const inputPassword = e.target.value;
    const isInputValid = isPasswordValid(inputPassword);
    setIsValid(isInputValid);
    setPassword(inputPassword);

    const output_password = truncate ? 
      inputPassword.substring(0, MAX_LENGTH-1) : inputPassword;
    onChange?.({
      'isValid': isInputValid,
      'password': output_password
    });
  }

  function isPasswordValid(inputPassword) {
    if(inputPassword.length === 0 ) { return false; }
    var isValidPassword = true;
    if(restrictLength){
      isValidPassword = inputPassword.length > MIN_LENGTH &&
        inputPassword.length < MAX_LENGTH;
    }
    
    // Confirm the input contains each required characters types.
    if(requireCharacters) {
      if(!(UPPERCASE_REGEX.test(inputPassword))) { return false; }
      if(!(LOWERCASE_REGEX.test(inputPassword))) { return false; }
      if(!(NUMERICAL_REGEX.test(inputPassword))) { return false; }
      if(!hasCommonCharacter(VALID_SYMBOLS, inputPassword)) { return false; }
    }

    return isValidPassword;
  }

  /**
   * Checks if two strings share a common character.
   * @param {*} strA 
   * @param {*} strB 
   * @returns True if strB contains a character from strA
   */
  function hasCommonCharacter(strA, strB) {
    for (const char in strA) {
      if(strB.indexOf(strA[char]) !== -1){ 
        return true
      }
    }
    return false
  }

  function displayErrorText() {
    if (!isAltered && !showRequired) { return null; }
    if(password.length === 0 || password === null || showRequired) {
        return '*Required';
    }

    let length_warning = ''
    if(restrictLength){
      if(password.length <= MIN_LENGTH) {
        length_warning += 'be longer than ' + MIN_LENGTH +
          ' characters';
      } else if(password.length >= MAX_LENGTH)
        length_warning += 'be shorter than ' + MAX_LENGTH +
          ' characters';
    }

    let missing_characters = []
    if(requireCharacters) {
      if(!(UPPERCASE_REGEX.test(password))) {
        missing_characters.push('an uppercase letter'); 
      }
      if(!(LOWERCASE_REGEX.test(password))) {
        missing_characters.push('a lowercase letter'); 
      }
      if(!(NUMERICAL_REGEX.test(password))) {
        missing_characters.push('a number');
      }
      if(!hasCommonCharacter(VALID_SYMBOLS, password)) {
        missing_characters.push('a symbol');
      }
    }

    // Format the error text correctly.
    let missing_warning = ''
    if(missing_characters.length == 1) {
      missing_warning += 'contain ' + missing_characters[0]
    } else if(missing_characters.length > 1) {
      missing_warning += 'contain '
      for(let i=0; i<missing_characters.length-1; i++) {
        missing_warning += missing_characters[i] + ', ' 
      }
      missing_warning += ' and ' + missing_characters[missing_characters.length-1] 
    }

    // Combine the warnings into a single message to display.
    if(length_warning.length !== 0 && missing_characters.length !== 0) {
      return 'Passwords must ' + length_warning + ' and ' + missing_warning + '.';
    } else if(length_warning.length !== 0){
      return 'Passwords must ' + length_warning + '.'
    } else if(missing_characters.length !== 0){
      return 'Passwords must ' + missing_warning + '.'
    }

    return null;
  }

  function isErrorActive(){
    return showRequired || (isAltered && !isValid);
  }

  return (
    <TextField error={isErrorActive()} id='outlined-password-input' 
      name='password' label={label} type='password' 
      helperText={displayErrorText()} onChange={updateState} />
  );
}

export default PasswordInputField;