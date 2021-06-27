import React , { useState, useEffect } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg'; 
import axios from 'axios';
function Signup() {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [phone, setPhone] = useState('');
  // const [password, setPassword] = useState('');
  // const [errorStatus, setError] = useState(false);

  const [formState, setState]= useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    errorStatus : false
    }
  );
  useEffect(()=>{
    console.log(formState.errorStatus)

  });
  const submitRegister = () =>{
    axios.post('http://crossfit.com:8005/CreateUser', {
            name: formState.name,
            phone: formState.phone,
            email: formState.email,
            password: formState.password
        })
        .then(function(response) {
          console.log(response.data)
          setState({
            ...formState,
             errorStatus: response.data.emailErrorStatus ,
          })
          localStorage.setItem('user_token', response.data.token);
          window.location.href = "http://localhost:3000";
        })
        .catch(function(error) {
            console.log(error);
        });
  }
  return (
    <div className="inner-container">
      <div className="header">
        Signup
      </div>
      <div className="box">



        <div className="input-group">
          <LabelField htmlFor="username" text="name"/>
          <InputField name="username"
          type="text"
            className="login-input"
            placeholder="name"
            onChange={e =>
              setState({
                ...formState,
                 name: e.target.value ,
              })}
            // e.target.value)}
            />
        </div>
        // TODO: add email verify
        <div className="input-group">
          <LabelField htmlFor="email" text="Email"/>
          <InputField 
          name="email" 
          type="text"
           lassName="login-input"
            placeholder="Email"
            onChange={e => 
              setState({
                ...formState,
                 email: e.target.value ,
              })}
            // setEmail(e.target.value)}
            />
        </div>
        // TODO: add phone verify
        <div className="input-group">
          <LabelField htmlFor="phone" text="Phone Number"/>
          <InputField 
          name="phone" 
          type="number" 
          className="login-input" 
          placeholder="Phone Number"
          onChange={e => 
            setState({
              ...formState,
               phone: e.target.value ,
            })}
            // setPhone(e.target.value)}
          />
        </div>


      
        <div className="input-group">
          <LabelField htmlFor="password" text="Password"/>
          <InputField
            name="password"
            type="password"
            className="login-input"
            placeholder="Password"
            onChange={e => 
              setState({
                ...formState,
                 password: e.target.value ,
              })}
              // {setPassword(e.target.value)} }
            />
        </div>
        // TODO: add password verify
        <div className="input-group">
          <LabelField htmlFor="password" text="Confirm Password"/>
          <InputField
            name="password"
            type="password"
            className="login-input"
            placeholder="Confirm Password"/>
        </div>
        <Button  
        className="signup-btn"
        onClick={submitRegister}
        text="Signup"
        />
        {
          (formState.errorStatus && <ErrorMsg text="Oops, The user already exists"/> ) 
        }
        {/* { errorStatus && <ErrorMsg text="Oops, The user already exists"/> } */}
      </div>
    </div>
  );
  }



export default Signup;