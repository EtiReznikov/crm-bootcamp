import React, { useState } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import axios from 'axios';
import LinkHref from '../../SubComponents/Link/LinkHref';
import {
  Redirect
} from "react-router-dom";
import '../../../Views/Form.scss';
function ForgotPassword(props) {
  const [formState, setState] = useState({
    email: "",
    errorStatus: -1
  }
  );

  //**On submit forgot password form */
  const onSubmit = (e) => {
    axios.post('http://crossfit.com:8005/Password/ResetPasswordReq', {
      email: formState.email,
    })
      .then(function (response) {
        setState({
          ...formState,
          errorStatus: response.data.status,
        });
      })
      .catch(function (error) {
        setState({
          ...formState,
          errorStatus: error.response.data.status,
        })
      });
    e.preventDefault();
  }

  return (
    <div className="form_wrapper">
      <div className="form_container">
        <div className="title_container">
          <h2>Forgot my password</h2>
        </div>
       
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
              {formState.errorStatus !== 1 && <ErrorMsg />}
              <input className="button" type="submit" value="Submit"
                onClick={onSubmit
                  .bind(this)}
                text="Submit"
              />
              <LinkHref className="info-link-forgotPass" href="/loginSignup" text="return to login page" />
            </form>
          </div>
        
        {
          (formState.errorStatus === 0  && <Redirect to={{
            pathname: "/msgPage",
            state: {
              icon: "fa fa-check-circle",
              headLine: "A link to reset password sent to you.",
              text_1: "Please check your inbox (Or spam folder)",
            }
          }}
          />) ||
          (formState.errorStatus === 3 && <Redirect to={{
            pathname: "/msgPage",
            state: {
              icon: "fa fa-exclamation-circle",
              headLine: "Something went wrong",
              text_1: "please ",
              link: "/forgotPassword",
              aText: "click here",
              text_2: " to try again.",
              className: "msg-page-link"
            }
          }} />)
        }
      </div>
    </div>

  )
}

export default ForgotPassword;