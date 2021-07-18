import React, { useState } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import axios from 'axios';
import LinkHref from '../../SubComponents/Link/LinkHref';
import Text from '../../SubComponents/Text/Text';
import '../../../Views/Form.scss';
import './ForgotPassword.scss'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
function ForgotPassword(props) {
  const [formState, setState] = useState({
    email: "",
    errorStatus: -1
  }
  );
  const [btnActive, setBtnActive] = useState(true);

  //**On submit forgot password form */
  const onSubmit = (e) => {
    if (formState.email.length === 0) {
      setState({
        ...formState,
        errorStatus: 2,
      });
      setBtnActive(true);
    }
    else {
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
          setBtnActive(true);
        });
    }
    e.preventDefault();
  }

  return (
    <div className="form_wrapper" id="forgot-pass">
      <div className="form_container">
        <div className="title_container">
          <h2>Forgot my password</h2>
        </div>

        <div className="">
          <form>
            <div className="input_field"> <span><i aria-hidden="true" className="fa fa-envelope"></i></span>
              <input type="email" name="email" placeholder="Email" onChange={e => {
                setBtnActive(true)
                setState({
                  ...formState,
                  email: e.target.value,
                })
              }}
              />
            </div>
            {formState.errorStatus === 3 && <ErrorMsg text="Something went wrong, please try again" />}
            {formState.errorStatus === 2 && <ErrorMsg text="Email is required" />}
            {formState.errorStatus === 1 && <ErrorMsg text="User is not exists" />}
            {formState.errorStatus !== 1 && <ErrorMsg />}
          
            {btnActive && <input className="button" type="submit" value="Submit" disabled={!btnActive}
              onClick={(e) => {
                setBtnActive(false);
                onSubmit(e);
              }
              } />}
            {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}
            <LinkHref className="info-link-forgotPass" href="/loginSignup" text="return to login page" />
          </form>
        </div>
        {formState.errorStatus === 0 && <Text className="forgot-pass-text" text="A Link to reset password sent to your email." />}

        
      </div>
    </div>

  )
}

export default ForgotPassword;