import React, { useState, useEffect } from 'react';
import './LoginWrapper.scss'
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
      <div className="box-container">
        {
          (isLogin && <Login onUserChange={props.onUserChange} />) ||
          (isRegister && <Signup onUserChange={props.onUserChange} />)
        }
        <div>
         
          {
            (localStorage.getItem('user_token') && <Redirect to="/"> </Redirect>) ||
            (<div className="wrapperSign">
              <div> 
              <img id="logo" src={logo}/>
              </div>
               
              {!isLogin && 
              <>
              <Text className="text-controller" text="Already have a User?"/>
               <Button className="controller" text="Login" onClick={showLoginBox} />
              </>
             }
             {!isRegister && 
              <>
             <Text className="text-controller" text="Don't have a user?"/>
             <Button className="controller" text="Signup" onClick={showRegisterBox} />
             </>
             }
             
             
            </div>
            )}
        </div>
      </div>
    </div>

  );
}



export default LoginSingUp;