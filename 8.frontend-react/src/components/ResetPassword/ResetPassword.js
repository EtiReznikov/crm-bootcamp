import React, { useState } from 'react';
import '../ResetPassword/ResetPassword.scss'
import Headline from '../Headline/Headline';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import {
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
    // token from url
    const { token } = useParams()
    //Reset password submit
    const onSubmit = () => {
        const passwordValid = passwordStrengthValidation(formState.password)
        const passwordMatchValid = passwordMatchValidation(formState.password, formState.passwordConfirm);
        setState({
            ...formState,
            passwordMatchValid: passwordMatchValid,
            passwordValid: passwordValid
        })
        //passwords validation
        if (passwordValid !== 0 && passwordMatchValid === 0) {
            axios.post('http://crossfit.com:8005/NewPassword', {
                password: formState.password,
                conform: formState.confirm,
                token: token
            })
                .then(function (response) {
                    // TODO: move to sucsses page
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
                });
        }
    }
    /*TODO: check that link is valid*/
    return (
        <div className="box-container">
            <div className="inner-container">
            <Headline className="head-form"  text="Reset Your Password" />
                <div className="box">
                    <div>
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
                    </div>
                    <Button
                        className="signup-btn"
                        onClick={onSubmit}
                        text="Change Password"
                    />
                    {formState.successStatus === 1 && <ErrorMsg text="Something went wrong, please try again" />}
                    {formState.successStatus === 0 &&
                        <Redirect to={{
                            pathname: "/msgPage",
                            state: {
                                headLine: "Your password has been reset.",
                                link: "/LoginSignup",
                                aText: "click here",
                                text_2: "to login."
                            }
                        }}
                        />
                    }
                    {formState.successStatus === 2 && <Redirect to={{
                        pathname: "/msgPage",
                        state: {
                            headLine: "Invalid Password Reset Link",
                            text: "This link is no longer valid. please request a new link below",
                            link: "/ForgotPassword",
                            aText: "Get new reset password link"
                        }
                    }}
                    />}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;