import React , { useEffect, useState } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/label'
import Button from '../Button/Button'
import axios from 'axios';
import ErrorMsg from '../errorMsg/errorMsg'; 
function Login() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [errorStatus, setError] = useState();

  const [formState, setState]= useState({
    email: "",
    password: "",
    errorStatus : -1
    }
  );

  useEffect(()=>{

  });

  
  const submitLogin = () =>{
    axios.post('http://crossfit.com:8005/Login', {

            email: formState.email,
            password: formState.password
        })
        .then((response)=> {
          console.log(response.data)
          console.log("status "+response.data.status)
          setState({
            ...formState,
             errorStatus: response.data.status ,
          })

          localStorage.setItem('user_token', response.data.token);
          // window.location.href = "http://localhost:3000";
      
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
            onChange={e =>
              setState({
                ...formState,
                 email: e.target.value ,
              })}
              />

        </div>

        <div className="input-group">
          <LabelField htmlFor="password" text="Password"/>
          <InputField name="password"
            type="password"
            className="login-input"
            placeholder="Password"
            onChange={e =>
              setState({
                ...formState,
                 password: e.target.value ,
              })}
              />

        </div>
        <Button  
        className="login-btn"
        onClick={submitLogin
          .bind(this)}
        text="Login"
        />{
          (formState.errorStatus===0 && <ErrorMsg text="User is not exists"/> ) ||
          (formState.errorStatus===1 && <ErrorMsg text="Oops! Wrong password"/> ) ||
          (formState.errorStatus===2 && <ErrorMsg text="Login is successful"/> )
        }
      </div>
    </div>
  );
}
export default Login;