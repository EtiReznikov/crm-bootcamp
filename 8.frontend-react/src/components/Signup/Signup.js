import React , { useState } from 'react';
import InputField from '../Input/input'
import LabelField from '../Label/label'
import Button from '../Button/button';
// import ErrorMsg from '../errorMsg/errorMsg'; 
import axios from 'axios';
function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  // const [errorStatus, setError] = useState(false);


  const submitRegister = () =>{
    axios.post('http://crossfit.com:8005/CreateUser', {
            name: name,
            phone: phone,
            email: email,
            password: password
        })
        .then(function(response) {
          localStorage.setItem('user_token', response.data.token);
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
            onChange={e =>setName(e.target.value)}/>
        </div>

        <div className="input-group">
          <LabelField htmlFor="email" text="Email"/>
          <InputField 
          name="email" 
          type="text"
           lassName="login-input"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}/>
        </div>

        <div className="input-group">
          <LabelField htmlFor="phone" text="Phone Number"/>
          <InputField 
          name="phone" 
          type="number" 
          className="login-input" 
          placeholder="Phone Number"
          onChange={e => setPhone(e.target.value)}
          />
        </div>


      
        <div className="input-group">
          <LabelField htmlFor="password" text="Password"/>
          <InputField
            name="password"
            type="password"
            className="login-input"
            placeholder="Password"
            onChange={e => {setPassword(e.target.value)}
            }/>
        </div>
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
        {/* { errorStatus && <ErrorMsg text="Oops, The user already exists"/> } */}
      </div>
    </div>
  );
  }



export default Signup;