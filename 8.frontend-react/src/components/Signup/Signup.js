import React, { useState, useEffect } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import Headline from '../Headline/Headline';
import { emailValidation, phoneValidation, nameValidation, nameLengthValidation, phoneLengthValidation, passwordStrengthValidation, passwordMatchValidation } from '../../tools/validation';
function Signup(props) {

  const [formState, setState] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    businessName: "",
    AfterSubmitErrorStatus: false,
    nameValid: 0,
    emailValid: 0,
    phoneValid: 0,
    passwordValid: -1,
    passwordMatchValid: true,
    businessValid: true
  }
  );
  // useEffect(() => {


  // });
  const submitRegister = () => {
    //if valid
    const nameValid = nameLengthValidation(formState.name);
    const phoneValid = phoneLengthValidation(formState.phone);
    const businessValid =  formState.businessName.length>0;
    const emailValid = emailValidation(formState.email);
    const passwordValid = passwordStrengthValidation(formState.password)
    const passwordMatchValid = passwordMatchValidation(formState.password, formState.passwordConfirm)
    setState({
      ...formState,
      nameValid: nameValid,
      phoneValid: phoneValid,
      emailValid: emailValid,
      passwordValid: passwordValid,
      passwordMatchValid: passwordMatchValid,
      businessValid: businessValid
    })
    const valid = (nameValid === 0 && phoneValid === 0 && emailValid === 0 &&
      (passwordValid === 1 || passwordValid === 2 || passwordValid === 3) && passwordMatchValid === 0 && businessValid)
    if (valid) {
      axios.post('http://crossfit.com:8005/CreateUser', {
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        businessName: formState.businessName,
        password: formState.password,
        confirm: formState.passwordConfirm,
        
      })
        .then(function (response) {
          console.log(response.data)
          setState({
            ...formState,
            emailValid: response.data.emailErrorStatus
          })
          if (response.data.emailErrorStatus !== 3 && response.data.formValid) {
            console.log(response.data.formValid)
            localStorage.setItem('user_token', response.data.token);
            props.onUserChange(true);
            /* TODO: replace with redirect */
            window.location.href = "http://localhost:3000";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  return (
    <div className="inner-container">
      <Headline text="Signup" />

      <div className="box">
        <div className="input-group">
          <LabelField htmlFor="name" text="Name" />
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
            }
            }
          />
        </div>
        {
          (formState.nameValid === 1 && <ErrorMsg text="Oops! Your name can only contain letters and spaces" />) ||
          (formState.nameValid === 2 && <ErrorMsg text="Oops! Your name must contain at least 2 letters" />)
        }
        <div className="input-group">
          <LabelField htmlFor="email" text="Email" />
          <InputField
            name="email"
            type="text"
            lassName="login-input"
            placeholder="type your email"
            onChange={e =>
              setState({
                ...formState,
                email: e.target.value,
              })}
          />
        </div>
        {
          (formState.emailValid === 1 && <ErrorMsg text="Oops! Email address is required" />) ||
          (formState.emailValid === 2 && <ErrorMsg text="Oops! Invalid email address" />) ||
          (formState.emailValid === 3 && <ErrorMsg text="Oops, The user already exists" />)
        }
        {
          (formState.AfterSubmitErrorStatus && <ErrorMsg text="Oops, The user already exists" />)
        }
        <div className="input-group">
          <LabelField htmlFor="phone" text="Phone Number" />
          <InputField
            name="phone"
            type="text"
            className="login-input"
            placeholder="type your email phone number"
            onChange={e =>
              setState({
                ...formState,
                phone: e.target.value,
              })}
            onKeyUp={e => {
              setState({
                ...formState, phoneValid: phoneValidation(e.target.value)
              })
            }
            }
          />

        </div>
        {
          (formState.phoneValid === 1 && <ErrorMsg text="Oops! A phone number should contain only numbers" />) ||
          (formState.phoneValid === 2 && <ErrorMsg text="Oops! A phone number should exactly 10 digits" />)
        }
        <div className="input-group">
          <LabelField htmlFor="businessName" text="Business Name" />
          <InputField name="businessName"
            type="text"
            className="signup-input"
            placeholder="type your business name"
            onChange={e =>
              setState({
                ...formState,
                businessName: e.target.value,
              })}
          />
        </div>
        {!formState.businessValid && <ErrorMsg text="Oops! Business Name is required" />}
        <div className="input-group">
          <LabelField htmlFor="password" text="Password" />
          <InputField
            name="password"
            type="password"
            className="login-input"
            placeholder="type your password"
            onChange={e =>
              setState({
                ...formState,
                password: e.target.value,
              })}
            onKeyUp={e => {
              setState({
                ...formState, passwordValid: passwordStrengthValidation(e.target.value)
              })
            }
            }
          />

        </div>
        {
          (formState.passwordValid === 0 && <ErrorMsg text="Oops! Password must contain at least 8 characters, one letter and one number" />) ||
          (formState.passwordValid === 1 && <ErrorMsg text="weak password" />) ||
          (formState.passwordValid === 2 && <ErrorMsg text="medium password" />) ||
          (formState.passwordValid === 3 && <ErrorMsg text="strong password" />)

        }
        <div className="input-group">
          <LabelField htmlFor="passwordConfirm" text="Confirm Password" />
          <InputField
            name="passwordConfirm"
            type="password"
            className="login-input"
            placeholder="type your password again"
            onChange={e =>
              setState({
                ...formState,
                passwordConfirm: e.target.value,
              })}
          />
        </div>
        {
          (formState.passwordValid === 1 || formState.passwordValid === 2 || formState.passwordValid === 3) && formState.passwordMatchValid === 1 && <ErrorMsg text="Oops! Passwords do not match" />
        }
        <Button
          className="signup-btn"
          onClick={submitRegister}
          text="Signup"
        />
        {
          (formState.AfterSubmitErrorStatus && <ErrorMsg text="Oops, The user already exists" />)
          
        }

      </div>
    </div>
  );
}



export default Signup;