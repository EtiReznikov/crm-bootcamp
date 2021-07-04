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
import '../../Views/Form.scss';
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
    <div className="form_wrapper">
    <div className="form_container">
      <div className="title_container">
        <h2>Forgot my password</h2>
      </div>
      <div className="row clearfix">
        <div className="">
          <form>
            <div className="input_field"> <span><i aria-hidden="true" className="fa fa-envelope"></i></span>
              <input type="email" name="email" placeholder="Email" onChange={e =>
                setState({
                  ...formState,
                  email: e.target.value,
                })}
              />
            </div>
            {formState.errorStatus === 1 && <ErrorMsg text="User is not exists" />}
            {formState.errorStatus === -1 && <ErrorMsg />}
            <input className="button" type="submit" value="Submit"
              onClick={onSubmit
                .bind(this)}
              text="Submit"
            />
               <LinkHref className="info-link-forgotpass" href="/LoginSignup" text="return to login page" />
          </form>
        </div>
      </div>
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