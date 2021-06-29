import React, { useEffect, useState } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button'
import axios from 'axios';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Headline from '../Headline/Headline';
import { emailValidation } from '../../tools/validation';
import LinkHref from '../Link/LinkHref';
function Login() {

  const [formState, setState] = useState({
    email: "",
    password: "",
    errorStatus: -1,
    emailValid: -1
  }
  );

  useEffect(() => {

  });


  const submitLogin = () => {
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
          if (response.data.status == 2) {
            localStorage.setItem('user_token', response.data.token);
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
      <Headline text="Login" />
      <div className="box">
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
          (formState.emailValid === 1 && <ErrorMsg text="Oops! Email address is required" />) ||
          (formState.emailValid === 2 && <ErrorMsg text="Oops! Invalid email address" />)
        }


        <div className="input-group">
          <LabelField htmlFor="password" text="Password" />
          <InputField name="password"
            type="password"
            className="login-input"
            placeholder="type your email"
            onChange={e =>
              setState({
                ...formState,
                password: e.target.value,
              })}
          />

        </div>

        <Button
          className="login-btn"
          onClick={submitLogin
            .bind(this)}
          text="Login"
        />
        {
          (formState.errorStatus !== 2 && <ErrorMsg text="Email or Password incorrect" />) 
        }
      </div>
      <LinkHref href="/ForgotPassword" text="Forgot my password"/>
    </div>
  );
}
export default Login;