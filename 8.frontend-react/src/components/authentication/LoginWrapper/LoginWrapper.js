import React, { useState } from 'react';
import './LoginWrapper.scss'
import '../../../Views/Form.scss'
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import {
  Redirect
} from "react-router-dom";
function LoginSingUp(props) {
  const [isLogin, setIsLogIn] = useState(props.isLogin);
  const [isRegister, setIsRegister] = useState(props.isRegister);

  const showLoginBox = () => {
    setIsLogIn(true);
    setIsRegister(false);
  }

  const showRegisterBox = () => {
    setIsLogIn(false);
    setIsRegister(true);
  }

  return (
    <div className="login-wrapper">

      <div className="form_wrapper">

        {
          (localStorage.getItem('user_token') && <Redirect to="/" />) ||
          (<div className="menu">
            <div className={"controller" + (isLogin ? "selected-controller" : "")}
              onClick={showLoginBox.bind(this)} active={isLogin}>
              Login
            </div>

            <div
              className={"controller" + (isRegister ? "selected-controller" : "")}
              onClick={showRegisterBox.bind(this)} active={isRegister}>
              Signup
            </div>
          </div>)}
        {
          (isLogin && <Login onUserChange={props.onUserChange} />) ||
          (isRegister && <Signup onUserChange={props.onUserChange} />)
        }
      </div>
    </div>
  );
}



export default LoginSingUp;