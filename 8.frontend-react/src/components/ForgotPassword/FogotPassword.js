import React, { useState } from 'react';
import Headline from '../Headline/Headline';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import Text from '../Text/Text';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import LinkHref from '../Link/LinkHref';
import {
  Redirect
} from "react-router-dom";
import './ForgotPassword.scss'
function ForgotPassword(props) {
  const [formState, setState] = useState({
    email: "",
    errorStatus: -1
  }
  );

  //**On submit forgot password form */
  const onSubmit = () => {
    axios.post('http://crossfit.com:8005/ResetPasswordReq', {
      email: formState.email,
    })
      .then(function (response) {
        setState({
          ...formState,
          errorStatus: response.data.status,
        })
      })
      .catch(function (error) {
        setState({
          ...formState,
          errorStatus: error.data.status,
        })
      });
  }

  return (
    <div className="box-container">
      <div className="inner-container">
        <Headline className="head-form-forgot-password" text="Forgot your password?" />
        <div className="box">
          <div className="input-group">
            <LabelField htmlfor="email" text="Email" />
            <InputField name="email"
              type="text"
              className="login-input"
              placeholder="Type your email"
              onChange={e =>
                setState({
                  ...formState,
                  email: e.target.value,
                })}
            />
          </div>
          {formState.errorStatus === 1 && <ErrorMsg text="User is not exists" />} 
          {formState.errorStatus === -1 && <ErrorMsg /> }
          <Text className="up-form-text" text="We will send you an email with instructions" />
          <Button
            className="forgotPass-btn"
            onClick={onSubmit
              .bind(this)}
            text="Submit"
          />

        </div>
        <LinkHref className="info-link-forgotpass" href="/LoginSignup" text="return to login page" />
        {
          (formState.errorStatus === 0 && <Redirect to={{
            pathname: "/msgPage",
            state: {
              headLine: "A link to reset password sent to you",
              text_1: "Please check your inbox (Or spam folder)",
            }
          }}
          />) ||
          (formState.errorStatus === 2 && <Redirect to={{
              pathname: "/msgPage",
              state: {
                  headLine: "Something went wrong",
                  text_1: "please ",
                  //*TODO change to signup
                  link: "/ForgotPassword",
                  aText: "click here",
                  text_2: " to try again.",
                  className: "msg-page-link"
              }
          }} /> )
        }
      </div>
    </div>
  )
}

export default ForgotPassword;