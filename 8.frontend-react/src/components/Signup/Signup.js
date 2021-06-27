import React, { useState, useEffect } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import { emailValidation, phoneValidation, nameValidation, nameLengthValidation, phoneLengthValidation, passwordStrengthValidation, passwordMatchValidation } from '../../tools/validation';
function Signup() {

  const [formState, setState] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    AfterSubmitErrorStatus: false,
    nameValid: 0,
    emailValid: 0,
    phoneValid: 0,
    passwordValid: 0,
    passwordMatchValid: true
  }
  );
  useEffect(() => {
    

  });
  const submitRegister = () => {
    //if valid
    const nameValid = nameLengthValidation(formState.name);
    const phoneValid = phoneLengthValidation(formState.phone);
    const emailValid = emailValidation(formState.email);
    const passwordValid = passwordStrengthValidation(formState.password)
    const passwordMatchValid = passwordMatchValidation( formState.password, formState.passwordConfirm)
    setState({
      ...formState,
      nameValid: nameValid,
      phoneValid: phoneValid,
      emailValid: emailValid,
      passwordValid: passwordValid,
      passwordMatchValid: passwordMatchValid
    })
    const valid = nameValid === 0 && phoneValid === 0 && emailValid === 0 && passwordValid === 0 && passwordMatchValid === 0
    if (valid) {
      axios.post('http://crossfit.com:8005/CreateUser', {
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        password: formState.password
      })
        .then(function (response) {
          console.log(response.data)
          setState({
            ...formState,
            AfterSubmitErrorStatus: response.data.emailErrorStatus,
          })
          localStorage.setItem('user_token', response.data.token);
          window.location.href = "http://localhost:3000";
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    //else
  }
  return (
    <div className="inner-container">
      <div className="header">
        Signup
      </div>
      <div className="box">
        <div className="input-group">
          <LabelField htmlFor="name" text="name" />
          <InputField name="name"
            type="text"
            className="login-input"
            placeholder="type your name"
            onChange={e =>
              setState({
                ...formState,
                name: e.target.value,
              })}
            onKeyUp={e => {
              setState({
                ...formState, nameValid: nameValidation(e.target.value)
              })
              console.log("onKeyUp")
            }
            }

          />
          {
            (formState.nameValid === 1 && <ErrorMsg text="Oops! Your name can only contain letters and spaces" />) ||
            (formState.nameValid === 2 && <ErrorMsg text="Oops! Your name must contain at least 2 letters" />)
          }
        </div>
        <div className="input-group">
          <LabelField htmlFor="email" text="Email" />
          <InputField
            name="email"
            type="text"
            lassName="login-input"
            placeholder="Email"
            onChange={e =>
              setState({
                ...formState,
                email: e.target.value,
              })}
          />
          {
            (formState.emailValid === 1 && <ErrorMsg text="Oops! Email address is required" />) ||
            (formState.emailValid === 2 && <ErrorMsg text="Oops! Invalid email address" />)
          }

        </div>
        <div className="input-group">
          <LabelField htmlFor="phone" text="Phone Number" />
          <InputField
            name="phone"
            type="text"
            className="login-input"
            placeholder="Phone Number"
            onChange={e =>
              setState({
                ...formState,
                phone: e.target.value,
              })}
            onKeyUp={e => {
              setState({
                ...formState, phoneValid: phoneValidation(e.target.value)
              })
              console.log("onKeyUp")
            }
            }
          />
          {
            (!formState.phoneValid === 1 && <ErrorMsg text="Oops! A phone number should contain only numbers" />)
          }
        </div>



        <div className="input-group">
          <LabelField htmlFor="password" text="Password" />
          <InputField
            name="password"
            type="password"
            className="login-input"
            placeholder="Password"
            onChange={e =>
              setState({
                ...formState,
                password: e.target.value,
              })}
          />
          {
            formState.passwordValid === 1 && <ErrorMsg text="Oops! Password must contain at least 8 characters, one letter and one number" />
          }
        </div>
        <div className="input-group">
          <LabelField htmlFor="passwordConfirm" text="Confirm Password" />
          <InputField
            name="passwordConfirm"
            type="password"
            className="login-input"
            placeholder="Confirm Password"
            onChange={e =>
              setState({
                ...formState,
                passwordConfirm : e.target.value,
              })}
               />
        </div>
        {
          formState.passwordValid === 0 && formState.passwordMatchValid === 1 && <ErrorMsg text="Oops! Passwords do not match" />
        }
        <Button
          className="signup-btn"
          onClick={submitRegister}
          text="Signup"
        />
        {
          (formState.AfterSubmitErrorStatus && <ErrorMsg text="Oops, The user already exists" />)
        }
        {/* { AfterSubmitErrorStatus  && <ErrorMsg text="Oops, The user already exists"/> } */}
      </div>
    </div>
  );
}



export default Signup;