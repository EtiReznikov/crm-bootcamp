import React, { useEffect, useState } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button'
import axios from 'axios';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Headline from '../Headline/Headline';
import { emailValidation } from '../../tools/validation';
import LinkHref from '../Link/LinkHref';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faCoffee } from '@fortawesome/fontawesome-free-solid'
import './Login.scss'



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
          if (response.data.status == 2) {
            console.log("logged in")
            localStorage.setItem('user_token', response.data.token);
            props.onUserChange(true);
            window.location.href = "http://localhost:3000";

          }
        })
        .catch(function (error) {
          /*TODO: Redirect to error page */

        });
    }
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
                <input type="password" name="password" placeholder="Password" onChange={e =>
                  setState({
                    ...formState,
                    password: e.target.value,
                  })}
                />
              </div>
              {
                (formState.errorStatus !== 2
                  && <ErrorMsg text="Email or Password incorrect" />)
              }
              {
                (formState.errorStatus === 2
                  && <ErrorMsg />)
              }
              <input className="button" type="submit" value="Submit" onClick={submitLogin
                .bind(this)} />
              <LinkHref href="/ForgotPassword" text="Forgot my password" />
            </form>
          </div>
        </div>
      </div>
  );
}
export default Login;