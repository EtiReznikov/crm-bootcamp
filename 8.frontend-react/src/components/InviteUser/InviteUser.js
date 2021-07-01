import React, { useState, useEffect } from 'react';
import InputField from '../Input/Input'
import LabelField from '../Label/Label'
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import axios from 'axios';
import Headline from '../Headline/Headline';
import Text from '../Text/Text';
import './InviteUser.scss'
import {
    Redirect,
    useParams,
} from "react-router-dom";

import { nameValidation, phoneValidation, nameLengthValidation, phoneLengthValidation, passwordStrengthValidation, passwordMatchValidation } from '../../tools/validation';

function InviteUser(props) {
    const [formState, setState] = useState({
        name: "",
        phone: "",
        password: "",
        passwordConfirm: "",
        AfterSubmitErrorStatus: -1,
        formValid: true,
        nameValid: 0,
        phoneValid: 0,
        passwordValid: -1,
        passwordMatchValid: true,
    }
    );


    // const [IsLoggedIn , setIsLoggedIn] = useState( removeItem  ());
    const { token } = useParams()

    useEffect(() => {
        localStorage.removeItem('user_token');
        props.onUserChange(false);
    }, []);


    const submit = () => {
        //if valid
        const nameValid = nameLengthValidation(formState.name);
        const phoneValid = phoneLengthValidation(formState.phone);
        const passwordValid = passwordStrengthValidation(formState.password)
        const passwordMatchValid = passwordMatchValidation(formState.password, formState.passwordConfirm)
        setState({
            ...formState,
            nameValid: nameValid,
            phoneValid: phoneValid,
            passwordValid: passwordValid,
            passwordMatchValid: passwordMatchValid,
        })
        const valid = (nameValid === 0 && phoneValid === 0 &&
            (passwordValid === 1 || passwordValid === 2 || passwordValid === 3) && passwordMatchValid === 0)
        if (valid) {
            axios.post('http://crossfit.com:8005/CreateUserByInvite', {
                name: formState.name,
                phone: formState.phone,
                password: formState.password,
                confirm: formState.passwordConfirm,
                token: token
            })
                .then(function (response) {
                    setState({
                        ...formState,
                        AfterSubmitErrorStatus: response.data.successStatus,
                    })
                    if (response.data.formValid) {
                        localStorage.setItem('user_token', response.data.token);
                        props.onUserChange(true);
                        /* TODO: replace with redirect */
                        // this.props.history.push('/');
                        // window.location.href = "http://localhost:3000";
                    }

                })
                .catch(function (error) {
                });
        }
    }

    return (<div className="box-container">
        <div className="inner-container">
            <Headline className="head-form" text="Register" />
        
            <div className="box-inviteUser">
                <div className="formWrapper">
                <Text className="up-form-text" text="So happy to see you! we just need a few more details" />
                <div className="input-group">
                    <LabelField htmlFor="name" text="Name" />
                    <InputField name="name"
                        type="text"
                        className="login-input"
                        placeholder="type your name"
                        onChange={e =>
                            setState({
                                ...formState,
                                name: e.target.value,
                            })}
                        onKeyUp={e => {
                            setState({
                                ...formState, nameValid: nameValidation(e.target.value)
                            })
                        }
                        }
                    />
                </div>
                {
                    (formState.nameValid === 1 && <ErrorMsg text="Oops! Your name can only contain letters and spaces" />) ||
                    (formState.nameValid === 2 && <ErrorMsg text="Oops! Your name must contain at least 2 letters" />) ||
                    (formState.nameValid === 0 && <ErrorMsg />)
                }
                <div className="input-group">
                    <LabelField htmlFor="phone" text="Phone Number" />
                    <InputField
                        name="phone"
                        type="text"
                        className="login-input"
                        placeholder="type your email phone number"
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
                    (formState.phoneValid === 1 && <ErrorMsg text="Oops! A phone number should contain only numbers" />) ||
                    (formState.phoneValid === 2 && <ErrorMsg text="Oops! A phone number should exactly 10 digits" />) ||
                    (formState.phoneValid === 0 && <ErrorMsg />)
                }
                <div className="input-group">
                    <LabelField htmlFor="password" text="Password" />
                    <InputField
                        name="password"
                        type="password"
                        className="login-input"
                        placeholder="type your password"
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
                    (formState.passwordValid === 3 && <ErrorMsg text="strong password" />) ||
                    (formState.passwordValid === -1 && <ErrorMsg />)

                }
                <div className="input-group">
                    <LabelField htmlFor="passwordConfirm" text="Confirm Password" />
                    <InputField
                        name="passwordConfirm"
                        type="password"
                        className="login-input"
                        placeholder="type your password again"
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

                {(formState.passwordValid === -1 ) && formState.passwordMatchValid && <ErrorMsg/>}

                {

(formState.AfterSubmitErrorStatus === 2 && <ErrorMsg text="Oops, something went wrong, please try again" />) ||
(formState.AfterSubmitErrorStatus === 1 &&
    <Redirect to={{
        pathname: "/msgPage",
        state: {
            headLine: "Account created successfully ",
            link: "/",
            aText: "Go to home page"
        }
    }}
    />
)
}
                </div>
                <Button
                    className="signup-btn"
                    onClick={submit}
                    text="Submit"
                />
              
            </div>
        </div>

    </div>
    );
}

export default InviteUser;