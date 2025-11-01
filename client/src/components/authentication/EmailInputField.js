import { useState } from 'react';
import { TextField } from '@mui/material';
import validator from 'validator'

/**
 * An input field that provides basic validation for an entered email.
 * 
 * @param {Object} props
 * @param {function} [props.onChange] - Callback function called when input is changed.
 * @param {boolean} [props.showRequired] - Force the component to show the error state.
 */
const EmailInputField = ({ onChange, showRequired=false }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isAltered, setIsAltered] = useState(false);

  async function updateState(e) {
    setIsAltered(true);
    const inputEmail = e.target.value;
    const isInputValid = validator.isEmail(inputEmail);
    setIsValid(isInputValid);
    setEmail(inputEmail);
    onChange?.({
      'isValid': isInputValid,
      'email': inputEmail
    });
  }

  function displayErrorText() {
    if (!isAltered && !showRequired) { return null; }
    if(email.length === 0 || email === null || showRequired) {
      return '*Required';
    }
    if(!isValid){
      return 'Invalid email.';
    }
    return null;
  }

  function isErrorActive(){
    return showRequired || (isAltered && !isValid);
  }

  return (
    <TextField error={isErrorActive()} id='outlined-password-input' 
      name='email' label='Email' type='email' 
      helperText={displayErrorText()} onChange={updateState} />
  );
}

export default EmailInputField;
