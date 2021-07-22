import React, { useState } from 'react';
import axios from 'axios';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import { emailValidation } from '../../../tools/validation';
import LinkHref from '../../SubComponents/Link/LinkHref';
import './Login.scss'
import {
  Redirect
} from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";


function Login(props) {

  const [formState, setState] = useState({
    email: "",
    password: "",
    errorStatus: -1,
    emailValid: -1
  }
  );
  const [btnActive, setBtnActive] = useState(true)


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
          localStorage.setItem('business_id', response.data.businessId);
          localStorage.setItem('user_name', response.data.name);
          props.onUserChange(true);

        })
        .catch(function (error) {
          setState({
            ...formState,
            errorStatus: error.response.data.status
          })
          setBtnActive(true);
        });
    }
    else{
      setBtnActive(true);
    }
    e.preventDefault();
  }

  return (
    <div className="form_container">
      <div className="title_container">
        {/* <h2>Login</h2> */}
      </div>
     
          <form>
            <div className="input_field"> <span><i aria-hidden="true" className="fa fa-envelope"></i></span>
              <input type="email" name="email" placeholder="Email" onChange={e =>{
              setBtnActive(true)
                setState({
                  ...formState,
                  errorStatus:-1,
                  email: e.target.value,
                  emailValid: 0
                })}}
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
                 setBtnActive(true)
                setState({
                  ...formState,
                  errorStatus: -1,
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
              && <ErrorMsg text="Something went wrong, please try again" />
            }
            {btnActive && <input className="button" type="submit" value="Submit" disabled={!btnActive}
                        onClick={(e) => {
                            setBtnActive(false);
                            submitLogin(e);
                        }
                        } />}
            {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}
            <LinkHref className="Login-forgot-pass" href="/forgotPassword" text="Forgot my password" />
          </form>
        
    
    </div>
  );
}
export default Login;