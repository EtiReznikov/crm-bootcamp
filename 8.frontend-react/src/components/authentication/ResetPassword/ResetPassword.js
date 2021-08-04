import React, { useState } from 'react';
import './ResetPassword.scss'
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import axios from 'axios';
import {
    useParams,
} from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Text from '../../SubComponents/Text/Text';
import Loader from "react-loader-spinner";
import { passwordMatchValidation, passwordStrengthValidation } from '../../../tools/validation';


function ResetPassword(props) {
    const [formState, setState] = useState({
        password: "",
        confirm: "",
        passwordValid: -1,
        passwordMatchValid: true,
        successStatus: -1,
    });
    const [btnActive, setBtnActive] = useState(true)

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
            axios.post('http://localhost:8005/Password/NewPassword', {
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
                    setBtnActive(true);
                });
        }
        else {
            setBtnActive(true);
        }
        e.preventDefault();
    }
    /*TODO: check that link is valid*/
    return (
        <div className="form_wrapper" id="reset-pass-form">
            <div className="form_container">
                <div className="title_container">
                    <h2>Reset Password</h2>
                </div>
                <form>
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-lock"></i>
                        </span>
                        <input type="password" name="password" placeholder="Password" onChange={e => {
                            setState({
                                ...formState,
                                password: e.target.value,
                            })
                            setBtnActive(true);
                        }
                        }
                            onKeyUp={e => {
                                setState({
                                    ...formState, passwordValid: passwordStrengthValidation(e.target.value)
                                })
                            }
                            }
                        />
                    </div>
                    {
                        (formState.passwordValid === 0 && <ErrorMsg text="At least 8 characters, 1 letter and 1 number" />) ||
                        (formState.passwordValid === 1 && <ErrorMsg text="weak password" />) ||
                        (formState.passwordValid === 2 && <ErrorMsg text="medium password" />) ||
                        (formState.passwordValid === 3 && <ErrorMsg text="strong password" />) ||
                        (formState.passwordValid === -1 && <ErrorMsg />)

                    }
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-lock"></i>
                        </span>
                        <input type="password" name="password" placeholder="Re-type Password" onChange={e => {
                            setState({
                                ...formState,
                                passwordConfirm: e.target.value,
                            })
                            setBtnActive(true);
                        }}
                        />
                    </div>
                    {
                        (formState.passwordValid === 1 || formState.passwordValid === 2 || formState.passwordValid === 3) && formState.passwordMatchValid === 1 && <ErrorMsg text="Passwords do not match" />
                    }
                    {
                        (formState.passwordValid === -1) && <ErrorMsg />
                    }
                    {formState.successStatus === 1 && <ErrorMsg text="Something went wrong, please try again" />}
                    {formState.successStatus === 2 && <><ErrorMsg text="This link is no longer valid." />
                        <ErrorMsg id="error-link" text={<a href="/forgotPassword" >click here to get new link.</a>} /> </>}
                    {btnActive && <input className="button" type="submit" value="Submit" disabled={!btnActive}
                        onClick={(e) => {
                            setBtnActive(false);
                            onSubmit(e);
                        }
                        } />}
                    {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}
                    {formState.successStatus === 0 && <> <Text text="Your password has been reset." />
                        <a id="link-signIn" href="/loginSignup" > click here to login </a>
                    </>}
                </form>

            </div>
        </div >
    )
}

export default ResetPassword;