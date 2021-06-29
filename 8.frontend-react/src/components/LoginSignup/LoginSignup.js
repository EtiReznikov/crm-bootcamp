import React, { useState, useEffect } from 'react';
import '../LoginSignup/LoginSignup.scss'
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Button from '../Button/Button';

function LoginSingUp(props) {
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

  console.log(props)
  return (
    <div>
        {
          (localStorage.getItem('user_token') && <div>Logged in</div>) ||
          (<div  className="menu">
            {/* <div className={"controller" + (isLogin ? "selected-controller" : "")}
              onClick={showLoginBox.bind(this)}>
              Login
            </div> */}
            <Button  className="controller" text="Login" onClick={showLoginBox}  />
            <Button  className="controller" text="Signup" onClick={showRegisterBox}/>
            {/* <div
              className={"controller " + (isRegister ? "selected-controller" : "")}
              onClick={showRegisterBox.bind(this)}>
              Signup
            </div> */}
          </div>)}

      <div className="box-container">
      {
        (isLogin && <Login onUserChange={props.onUserChange}/>) ||
        (isRegister && <Signup onUserChange={props.onUserChange}/>)
      }

    </div>
    </div>
  );
}



export default LoginSingUp;