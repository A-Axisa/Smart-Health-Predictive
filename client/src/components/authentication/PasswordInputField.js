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
  showRequired=false, label='Password' }) => {
  
  const MIN_LENGTH = 14;
  const MAX_LENGTH = 65;
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
    return isValidPassword;
  }

  function displayErrorText() {
    if (!isAltered && !showRequired) { return null; }
    if(password.length === 0 || password === null || showRequired) {
        return '*Required';
    }
    if(restrictLength){
      if(password.length <= MIN_LENGTH) {
        return 'Passwords must be longer than ' + MIN_LENGTH +
          ' characters.';
      } else if(password.length >= MAX_LENGTH)
        return 'Passwords must be shorter than ' + MAX_LENGTH +
          ' characters.';
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