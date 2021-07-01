import React, { useState } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button'
import axios from 'axios';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Headline from '../Headline/Headline';
import { emailValidation } from '../../tools/validation';
import LinkHref from '../Link/LinkHref';
import {
  Redirect,
  useParams,
} from "react-router-dom";
import './Login.scss'
function Login(props) {

  const [successStatus, setStatus] = useState (0);
  const [formState, setState] = useState({
    email: "",
    password: "",
    status: 2,
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
            status: response.data.status,
          })
          // If request went well- save user token to local storage and redirect to home page
          if (response.data.status === 2) {
            localStorage.setItem('user_token', response.data.token);
            props.onUserChange(true);
            setState({
              ...formState,
              successStatus: 1
            })
          }
        })
        .catch(function (error) {
          if (error.response.data.message === 'server error'){
            setStatus(true);
          }
          setState({
            ...formState,
            status: error.response.data.status,
          })
        });
    }
  }

  return (
    <div className="inner-container">
      {successStatus == 1 && <Redirect to="/"/>} 
       {successStatus === 2 && <Redirect to={{
                        pathname: "/msgPage",
                        state: {
                            headLine: "Something went wrong",
                            text_1: "please ",
                            link: "/Login",
                            aText: "click here",
                            text_2: " to try again.",
                            className: "msg-page-link"
                        }
                    }} />
                }
      <Headline className="head-form" text="Login" />
      <div className="box">
        <div className="formWrapper">
        <div className="input-group">
          <LabelField htmlFor="email" text="Email" />
          <InputField name="email"
            type="text"
            className="login-input"
            placeholder="Type your email"
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
            && <ErrorMsg text="Oops! Invalid email address" />) ||
            <ErrorMsg/>
        }
        <div className="input-group">
          <LabelField htmlFor="password" text="Password" />
          <InputField name="password"
            type="password"
            className="login-input"
            placeholder="Type your password"
            onChange={e =>
              setState({
                ...formState,
                password: e.target.value,
              })}
          />
        </div>
        {
          (formState.status !== 2
            && <ErrorMsg id="login-error" text="Email or Password incorrect" />) ||
            <ErrorMsg/>
        }
        </div>
        <Button
          className="login-btn"
          onClick={submitLogin
            .bind(this)}
          text="Login"
        />
       
      </div>
      <LinkHref className="info-link" href="/ForgotPassword" text="Forgot my password" />
    </div>
  );
}
export default Login;