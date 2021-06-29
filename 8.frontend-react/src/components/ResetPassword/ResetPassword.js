import React, { useEffect, useState } from 'react';
import '../ResetPassword/ResetPassword.scss'
import Headline from '../Headline/Headline';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import Text from '../Text/Text';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import LinkHref from '../Link/LinkHref';
import {
    BrowserRouter as Router,
    useParams,
    Redirect
  } from "react-router-dom";
import { passwordMatchValidation, passwordStrengthValidation } from '../../tools/validation';
function ResetPassword(props) {
    const [formState, setState] = useState({
        password: "",
        confirm: "",
        passwordValid: -1,
        passwordMatchValid: true,
        successStatus: true,
    }
    );
 
   const { token } = useParams()

    const onSubmit = () => {
        
        const passwordMatchValid = passwordMatchValidation(formState.password, formState.passwordConfirm);
        setState({
            ...formState,
            passwordMatchValid: passwordMatchValid
        })
        if (passwordMatchValid === 0){
        axios.post('http://crossfit.com:8005/NewPassword', {
            password: formState.password,
            conform: formState.confirm,
            token: token
        })
            .then(function (response) {
                console.log(response);
                setState({
                    ...formState,
                    successStatus: response.data.successStatus,
                })
            })
            .catch(function (error) {
                setState({
                    ...formState,
                    successStatus: error.data.successStatus,
                })
                console.log(error);
            });
        }

    }

    return (
        <div className="box-container">
            <div className="inner-container">
            <Headline text="Reset Your Password" />
                <div className="box">
                <div className="input-group">
                    <LabelField htmlFor="password" text="Password" />
                    <InputField
                        name="password"
                        type="password"
                        className="login-input"
                        placeholder="type your new password"
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
                    (formState.passwordValid === 0 && <ErrorMsg text="Oops! Password must contain at least 8 characters, one letter and one number" />) ||
                    (formState.passwordValid === 1 && <ErrorMsg text="weak password" />) ||
                    (formState.passwordValid === 2 && <ErrorMsg text="medium password" />) ||
                    (formState.passwordValid === 3 && <ErrorMsg text="strong password" />)

                }
                <div className="input-group">
                    <LabelField htmlFor="passwordConfirm" text="Confirm Password" />
                    <InputField
                        name="passwordConfirm"
                        type="password"
                        className="login-input"
                        placeholder="type new password again"
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
                <Button
                    className="signup-btn"
                    onClick={onSubmit}
                    text="Change Password"
                />
                { formState.successStatus === 1 && <ErrorMsg text="Something went wrong, please try again" /> }
                { formState.successStatus === 0 && 
                    <div id="successMsg">
                    <Text text="Your password has been reset."/>  <LinkHref href="/LoginSignup" text="click here"/> <Text text="to login." /> 
                    </div>
                }
                {formState.successStatus==2 && <Redirect to="/linkInvalid" />}
                

            </div>
        </div>
        </div>
    )
}

export default ResetPassword;