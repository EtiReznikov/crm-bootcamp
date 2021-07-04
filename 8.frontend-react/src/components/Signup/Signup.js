import React, { useState, useEffect } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import Headline from '../Headline/Headline';
import { emailValidation, phoneValidation, nameValidation, nameLengthValidation, phoneLengthValidation, passwordStrengthValidation, passwordMatchValidation } from '../../tools/validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faCoffee } from '@fortawesome/fontawesome-free-solid'


function Signup(props) {

  const [formState, setState] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    businessName: "",
    AfterSubmitErrorStatus: false,
    nameValid: 0,
    emailValid: 0,
    phoneValid: 0,
    passwordValid: -1,
    passwordMatchValid: true,
    businessValid: true
  }
  );

  //On submit form
  const submitRegister = () => {

    const nameValid = nameLengthValidation(formState.name);
    const phoneValid = phoneLengthValidation(formState.phone);
    const businessValid = formState.businessName.length > 0;
    const emailValid = emailValidation(formState.email);
    const passwordValid = passwordStrengthValidation(formState.password)
    const passwordMatchValid = passwordMatchValidation(formState.password, formState.passwordConfirm)
    setState({
      ...formState,
      nameValid: nameValid,
      phoneValid: phoneValid,
      emailValid: emailValid,
      passwordValid: passwordValid,
      passwordMatchValid: passwordMatchValid,
      businessValid: businessValid
    })
    //form validation
    const valid = (nameValid === 0 && phoneValid === 0 && emailValid === 0 &&
      (passwordValid === 1 || passwordValid === 2 || passwordValid === 3) && passwordMatchValid === 0 && businessValid)
    if (valid) {
      axios.post('http://crossfit.com:8005/CreateUser', {
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        businessName: formState.businessName,
        password: formState.password,
        confirm: formState.passwordConfirm,
      })
        .then(function (response) {
          setState({
            ...formState,
            emailValid: response.data.emailErrorStatus
          })
          // If request went well- save user token to local storage and redirect to home page
          if (response.data.emailErrorStatus !== 3 && response.data.formValid) {
            localStorage.setItem('user_token', response.data.token);
            props.onUserChange(true);
            /* TODO: replace with redirect */
            window.location.href = "http://localhost:3000";
          }
        })
        .catch(function (error) {
          /*TODO: Redirect to error page */

          // setState({
          //   ...formState,
          //   AfterSubmitErrorStatus: true
          // })

        });
    }
  }
  return (
   
      <div className="form_container">
        <div className="title_container">
          <h2>SignUp</h2>
        </div>
        <div className="row clearfix">
          <div className="">
            <form>
              <div className="input_field" >
                <span>
                  <i aria-hidden="true" className="fa fa-user"></i>
                </span>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  onChange={e =>
                    setState({
                      ...formState,
                      name: e.target.value,
                    })}
                  onKeyUp={e => {
                    setState({
                      ...formState, nameValid: nameValidation(e.target.value)
                    })
                  }} />

              </div>
              {
                (formState.nameValid === 1 && <ErrorMsg text="Name can only contain letters and spaces" />) ||
                (formState.nameValid === 2 && <ErrorMsg text="Name must contain at least 2 letters" />) ||
                formState.nameValid === 0 && <ErrorMsg />
              }
              <div className="input_field">
                <span>
                  <i aria-hidden="true" className="fa fa-envelope"></i>
                </span>
                <input type="text" name="email" placeholder="Email" onChange={e =>
                  setState({
                    ...formState,
                    email: e.target.value,
                  })}
                />
              </div>
              {
                (formState.emailValid === 0 && <ErrorMsg />) ||
                (formState.emailValid === 1 && <ErrorMsg text="Email address is required" />) ||
                (formState.emailValid === 2 && <ErrorMsg text="Invalid email address" />) ||
                (formState.emailValid === 3 && <ErrorMsg text="The user already exists" />)
              }
              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-phone"></i></span>
                <input type="text" name="phone" placeholder="Phone Number"
                  onChange={e =>
                    setState({
                      ...formState,
                      phone: e.target.value,
                    })}
                  onKeyUp={e => {
                    setState({
                      ...formState, phoneValid: phoneValidation(e.target.value)
                    })
                  }
                  }
                />
              </div>
              {
                (formState.phoneValid === 0 && <ErrorMsg text="" />) ||
                (formState.phoneValid === 1 && <ErrorMsg text="Phone number should contain only numbers" />) ||
                (formState.phoneValid === 2 && <ErrorMsg text="Phone number should exactly 10 digits" />)
              }
              <div className="input_field">
                <span>
                  <i aria-hidden="true" className="fa fa-briefcase"></i>
                </span>
                <input type="text" name="business" placeholder="Business Name" />
              </div>
              {!formState.businessValid && <ErrorMsg text="Business Name is required" /> ||
                formState.businessValid && <ErrorMsg />}
              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-lock"></i></span>
                <input type="password" name="password" placeholder="Password"
                  onChange={e =>
                    setState({
                      ...formState,
                      password: e.target.value,
                    })}
                  onKeyUp={e => {
                    setState({
                      ...formState, passwordValid: passwordStrengthValidation(e.target.value)
                    })
                  }
                  }
                />
              </div>
              {
                (formState.passwordValid === 0 && <ErrorMsg text="Password must contain at least 8 characters,1 letter and 1 number" />) ||
                (formState.passwordValid === 1 && <ErrorMsg text="weak password" />) ||
                (formState.passwordValid === 2 && <ErrorMsg text="medium password" />) ||
                (formState.passwordValid === 3 && <ErrorMsg text="strong password" />) ||
                (formState.passwordValid === -1 && <ErrorMsg />)
              }

              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-lock"></i></span>
                <input type="password" name="password" placeholder="Re-type Password" required
                  onChange={e =>
                    setState({
                      ...formState,
                      passwordConfirm: e.target.value,
                    })}
                />
              </div>
              {
                (formState.passwordValid === 1 || formState.passwordValid === 2 || formState.passwordValid === 3) && formState.passwordMatchValid === 1 && <ErrorMsg text="Oops! Passwords do not match" />
              }
              {
                formState.passwordValid === -1 && formState.passwordMatchValid && <ErrorMsg />
              }
              {
                (formState.AfterSubmitErrorStatus && <ErrorMsg text="Something went wrong" />)
              }
              <input className="button" type="submit" value="Submit" onClick={submitRegister} />
            </form>
          </div>
        </div>
      </div>

  );
}



export default Signup;