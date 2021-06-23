import React , { useState } from 'react';
import InputField from '../Input/input'
import LabelField from '../Label/label'
import Button from '../Button/button'
import axios from 'axios';
import ErrorMsg from '../errorMsg/errorMsg'; 
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorStatus, setError] = useState(4);

  const submitLogin = () =>{
    axios.post('http://crossfit.com:8005/Login', {
            email: email,
            password: password
        })
        .then((response)=> {
          console.log(response.data)
          console.log(response.data.status)
          setError(errorStatus+1);
          console.log(errorStatus)
          localStorage.setItem('user_token', response.data.token);
      
        })
        .catch(function(error) {
            console.log(error);
        });
  }

  return (
    <div className="inner-container">
      <div className="header">
        Login
      </div>
      <div className="box">
        <div className="input-group">
          <LabelField htmlFor="email" text="Email" />
          <InputField name="email"
           type="text"
            className="login-input"
            placeholder="Email"
            onChange={e =>setEmail(e.target.value)}/>
        </div>

        <div className="input-group">
          <LabelField htmlFor="password" text="Password"/>
          <InputField name="password"
            type="password"
            className="login-input"
            placeholder="Password"
            onChange={e =>setPassword(e.target.value)}/>
        </div>
        <Button  
        className="login-btn"
        onClick={submitLogin
          .bind(this)}
        text="Login"
        />{
          (errorStatus===0 && <ErrorMsg text="User is not exists"/> ) ||
          ( errorStatus===1 && <ErrorMsg text="Oops! Wrong password"/> )
        }
      </div>
    </div>
  );
}
export default Login;