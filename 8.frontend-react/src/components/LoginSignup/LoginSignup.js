import React , { useState } from 'react';
import '../LoginSignup/LoginSignup.scss'
import Login from '../Login/Login';
import Signup from '../Signup/Signup';


function LoginSingUp() {
  const [isLogin, setIsLogIn] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  const  showLoginBox = () => {
    setIsLogIn(true);
    setIsRegister(false);
  }

  const showRegisterBox = () => {
    setIsLogIn(false);
    setIsRegister(true);
  }
  
  return (
    <div className="box-container">
      <div className="menu">
       <div
         className={"controller " + (isLogin ? "selected-controller": "")}
         onClick={showLoginBox.bind(this)}>
          Login
        </div>
       <div
         className={"controller " + (isRegister ? "selected-controller" : "")}
         onClick={showRegisterBox.bind(this)}>
         Signup
       </div>
  
       </div>
       {isLogin && <Login/>}
      {isRegister && <Signup/>}
      {/* { localStorage.getItem('user_token') && <div>Logged in</div>} */}
      {localStorage.removeItem('user_token') && localStorage.getItem('user_token') && <div>Logged in</div>}
   </div>

  );
}



export default LoginSingUp;