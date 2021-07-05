import React, { useState } from 'react';
import '../ResetPassword/ResetPassword.scss'
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
        // successStatus: true,
    });
    const [successStatus, setStatus] = useState(-1);

    // token from url
    const { token } = useParams()
    //Reset password submit
    const onSubmit = (e) => {
        const passwordValid = passwordStrengthValidation(formState.password)
        const passwordMatchValid = passwordMatchValidation(formState.password, formState.passwordConfirm);
        setState({
            ...formState,
            passwordMatchValid: passwordMatchValid,
            passwordValid: passwordValid
        })

        //passwords validation
        if (passwordValid !== 0 && passwordMatchValid === 0) {
            axios.post('http://crossfit.com:8005/Password/NewPassword', {
                password: formState.password,
                conform: formState.confirm,
                token: token
            })
                .then(function (response) {
                    setState({
                        ...formState,
                        successStatus: response.data.successStatus,
                    })
                })
                .catch(function (error) {
                    setState({
                        ...formState,
                        successStatus: error.response.data.successStatus,
                    })
                });
        }
        e.preventDefault();
    }
    /*TODO: check that link is valid*/
    return (
        <div className="form_wrapper">
            <div className="form_container">
                <div className="title_container">
                    <h2>Reset Password</h2>
                </div>
                <div className="row clearfix">
                    <div className="">
                        <form>

                            <div className="input_field">
                                <span>
                                    <i aria-hidden="true" className="fa fa-lock"></i>
                                </span>
                                <input type="password" name="password" placeholder="Password" onChange={e =>
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
                                (formState.passwordValid === 0 && <ErrorMsg text="Password must contain at least 8 characters, 1 letter and 1 number" />) ||
                                (formState.passwordValid === 1 && <ErrorMsg text="weak password" />) ||
                                (formState.passwordValid === 2 && <ErrorMsg text="medium password" />) ||
                                (formState.passwordValid === 3 && <ErrorMsg text="strong password" />) ||
                                (formState.passwordValid === -1 && <ErrorMsg />)

                            }
                            <div className="input_field">
                                <span>
                                    <i aria-hidden="true" className="fa fa-lock"></i>
                                </span>
                                <input type="password" name="password" placeholder="Re-type Password" onChange={e =>
                                    setState({
                                        ...formState,
                                        passwordConfirm: e.target.value,
                                    })}
                                />
                            </div>
                            {
                                (formState.passwordValid === 1 || formState.passwordValid === 2 || formState.passwordValid === 3) && formState.passwordMatchValid === 1 && <ErrorMsg text="Passwords do not match" />
                            }
                            {
                                (formState.passwordValid === -1) && <ErrorMsg />
                            }

                            {formState.successStatus === 1 &&
                                <Redirect to={{
                                    pathname: "/msgPage",
                                    state: {
                                        icon: "fa fa-exclamation-circle",
                                        headLine: "Something went wrong",
                                        text_1: "please ",
                                        link: "/ForgotPassword",
                                        aText: "click here",
                                        text_2: "to Get new reset password link"
                                    }
                                }} />}
                            {formState.successStatus === 0 &&
                                <Redirect to={{
                                    icon: "fa fa-check-circle",
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
                            {formState.successStatus === 2 &&
                                <Redirect to={{
                                    pathname: "/msgPage",
                                    state: {
                                        icon: "fa fa-exclamation-circle",
                                        headLine: "Invalid Password Reset Link",
                                        text: "This link is no longer valid. please request a new link below",
                                        link: "/ForgotPassword",
                                        aText: "Get new reset password link"
                                    }
                                }}
                                />
                            }
                            <input className="button" type="submit" value="Submit" onClick={onSubmit} />
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ResetPassword;