import React, { useState, useEffect } from 'react';
import './LoginWrapper.scss'
import '../../Views/Form.scss'
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Button from '../Button/Button';
import Text from '../Text/Text';
import Headline from '../Headline/Headline';
import logo from '../../Views/Daco_6140061.png'
import {
  useParams,
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
    <div className="login-warper">

      <div className="form_wrapper">

        {
          (localStorage.getItem('user_token') && <Redirect to="/" />) ||
          (<div className="menu">
            <div className={"controller" + (isLogin ? "selected-controller" : "")}
              onClick={showLoginBox.bind(this)}>
              Login
            </div>
            {/* <Button  className="controller" text="Login" onClick={showLoginBox}  />
            <Button  className="controller" text="Signup" onClick={showRegisterBox}/> */}
            <div
              className={"controller " + (isRegister ? "selected-controller" : "")}
              onClick={showRegisterBox.bind(this)}>
              Signup
            </div>
          </div>)}
        {/* <div className="box-container"> */}
        {
          (isLogin && <Login onUserChange={props.onUserChange} />) ||
          (isRegister && <Signup onUserChange={props.onUserChange} />)
        }

        {/* </div> */}
      </div>
    </div>
  );
}



export default LoginSingUp;