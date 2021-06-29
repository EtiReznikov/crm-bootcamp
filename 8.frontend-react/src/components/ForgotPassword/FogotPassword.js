import React, { useState } from 'react';
import Headline from '../Headline/Headline';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import Text from '../Text/Text';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import LinkHref from '../Link/LinkHref';
import './ForgotPassword.scss'
function ForgotPassword(props) {
  const [formState, setState] = useState({
    email: "",
    errorStatus: -1
  }
  );

  //**On sumbit forgot password form */
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
        console.log(error);
      });
  }

  return (
    <div className="box-container">
      <div className="inner-container">
        <Headline text="Forgot your password?" />
        <div className="box">
          <div className="input-group">
            <LabelField htmlfor="email" text="Email" />
            <InputField name="email"
              type="text"
              className="login-input"
              placeholder="type your email"
              onChange={e =>
                setState({
                  ...formState,
                  email: e.target.value,
                })}
            />
          </div>
          <Text text="We will send you an email with instructions" />
          <Button
            className="forgotPass-btn"
            onClick={onSubmit
              .bind(this)}
            text="Submit"
          />

        </div>
        <LinkHref href="/LoginSignup" text="return to login page" />
        {
          (formState.errorStatus === 0 && <Text text="Please check your inbox and click on the link in the email we have just sent you. (If it is not there, please check your spam mail folder)" />) ||
          (formState.errorStatus === 1 && <ErrorMsg text="User is not exists" />) ||
          (formState.errorStatus === 2 && <ErrorMsg text="Something went wrong please try again" />)
        }
      </div>
    </div>
  )
}

export default ForgotPassword;