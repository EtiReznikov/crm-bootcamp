import React, { useState, useEffect } from 'react';
import '../LoginSignup/LoginSignup.scss'
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Button from '../Button/Button';

function LoginSingUp() {
  const [isLogin, setIsLogIn] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  const showLoginBox = () => {
    setIsLogIn(true);
    setIsRegister(false);
  }

  const showRegisterBox = () => {
    setIsLogIn(false);
    setIsRegister(true);
  }
  useEffect(() => {
    if (localStorage.getItem('user_token')) {
      setIsLogIn(false);
      setIsRegister(false);
    }
  }, []);
  return (
    <div>
        {
          (localStorage.getItem('user_token') && <div>Logged in</div>) ||
          (<div  className="menu">
            {/* <div className={"controller" + (isLogin ? "selected-controller" : "")}
              onClick={showLoginBox.bind(this)}>
              Login
            </div> */}
            <Button  className="controller" text="Login" onClick={showLoginBox.bind(this)}/>
            <Button  className="controller" text="Signup" onClick={showRegisterBox.bind(this)}/>
            {/* <div
              className={"controller " + (isRegister ? "selected-controller" : "")}
              onClick={showRegisterBox.bind(this)}>
              Signup
            </div> */}
          </div>)}

      <div className="box-container">
      {
        (isLogin && <Login />) ||
        (isRegister && <Signup />)
      }

    </div>
    </div>
  );
}



export default LoginSingUp;