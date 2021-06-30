import React, { useState } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button'
import axios from 'axios';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Headline from '../Headline/Headline';
import { emailValidation } from '../../tools/validation';
import LinkHref from '../Link/LinkHref';
function Login(props) {


  const [formState, setState] = useState({
    email: "",
    password: "",
    errorStatus: 2,
    emailValid: -1
  }
  );

  //On submit form
  const submitLogin = () => {
    // email validation
    const valid = emailValidation(formState.email);
    setState({
      ...formState,
      emailValid: valid
    })
    if (valid === 0) {
      axios.post('http://crossfit.com:8005/Login', {
        email: formState.email,
        password: formState.password
      })
        .then((response) => {
          setState({
            ...formState,
            errorValid: 0,
            errorStatus: response.data.status,
          })
          // If request went well- save user token to local storage and redirect to home page
          if (response.data.status === 2) {
            localStorage.setItem('user_token', response.data.token);
            props.onUserChange(true);
            /*TODO: replce with redirect */
            window.location.href = "http://localhost:3000";

          }
        })
        .catch(function (error) {
          /*TODO: Redirect to error page */
        
        });
    }
  }

  return (
    <div className="inner-container">
      <Headline className="head-form" text="Login" />
      <div className="box">
        <div>
        <div className="input-group">
          <LabelField htmlFor="email" text="Email" />
          <InputField name="email"
            type="text"
            className="login-input"
            placeholder="type your email"
            onChange={e =>
              setState({
                ...formState,
                email: e.target.value,
                emailValid: 0
              })}
          />
        </div>
        {
          (formState.emailValid === 1
            && <ErrorMsg text="Oops! Email address is required" />) ||
          (formState.emailValid === 2
            && <ErrorMsg text="Oops! Invalid email address" />)
        }
        <div className="input-group">
          <LabelField htmlFor="password" text="Password" />
          <InputField name="password"
            type="password"
            className="login-input"
            placeholder="type your password"
            onChange={e =>
              setState({
                ...formState,
                password: e.target.value,
              })}
          />
        </div>
        </div>
        <Button
          className="login-btn"
          onClick={submitLogin
            .bind(this)}
          text="Login"
        />
        {
          (formState.errorStatus !== 2
            && <ErrorMsg text="Email or Password incorrect" />)
        }
      </div>
      <LinkHref className="info-link" href="/ForgotPassword" text="Forgot my password" />
    </div>
  );
}
export default Login;