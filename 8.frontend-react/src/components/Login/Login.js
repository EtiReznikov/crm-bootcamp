import React, { useState } from 'react';
import axios from 'axios';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import { emailValidation } from '../../tools/validation';
import LinkHref from '../Link/LinkHref';
import './Login.scss'
import {
  Redirect
} from "react-router-dom";


function Login(props) {

  const [formState, setState] = useState({
    email: "",
    password: "",
    errorStatus: -1,
    emailValid: -1
  }
  );


  //On submit form
  const submitLogin = (e) => {
    // email validation
    const valid = emailValidation(formState.email);
    setState({
      ...formState,
      emailValid: valid
    })
    if (valid === 0) {
      axios.post('http://crossfit.com:8005/Auth/Login', {
        email: formState.email,
        password: formState.password
      })
        .then((response) => {
          setState({
            ...formState,
            errorStatus: response.data.status,
          })
          // If request went well- save user token to local storage and redirect to home page
          localStorage.setItem('user_token', response.data.token);
          props.onUserChange(true);

        })
        .catch(function (error) {
          setState({
            ...formState,
            errorStatus: error.response.data.status
          })
        });
    }
    e.preventDefault();

  }

  return (
    <div className="form_container">
      <div className="title_container">
        <h2>Login</h2>
      </div>
      <div className="row clearfix">
        <div className="">
          <form>
            <div className="input_field"> <span><i aria-hidden="true" className="fa fa-envelope"></i></span>
              <input type="email" name="email" placeholder="Email" onChange={e =>
                setState({
                  ...formState,
                  email: e.target.value,
                  emailValid: 0
                })}
              />
            </div>
            {
              (formState.emailValid === 1
                && <ErrorMsg text="Email address is required" />) ||
              (formState.emailValid === 2
                && <ErrorMsg text="Invalid email address" />)
            }
            <div className="input_field"> <span><i aria-hidden="true" className="fa fa-lock"></i></span>
              <input type="password" name="password" placeholder="Password" onChange={e => {
                setState({
                  ...formState,
                  password: e.target.value,
                })
              }}
              />
            </div>
            {
              formState.errorStatus === 0
              && <ErrorMsg text="Email or Password incorrect" />
            }
            {
              formState.errorStatus === -1
              && <ErrorMsg />
            }
            {
              formState.errorStatus === 2
              && <Redirect to="/" />
            }
            {
              formState.errorStatus === 3
              && <Redirect to={{
                pathname: "/msgPage",
                state: {
                  icon: "fa fa-exclamation-circle",
                  headLine: "Something went wrong",
                  text_1: "please ",
                  link: "/LoginSignup",
                  aText: "click here",
                  text_2: " to try again.",
                  className: "msg-page-link"
                }
              }} />
            }
            <input className="button" type="submit" value="Submit" onClick={submitLogin} />
            <LinkHref className="Login-forgot-pass" href="/ForgotPassword" text="Forgot my password" />
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;