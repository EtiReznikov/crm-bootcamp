
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Headline from '../Headline/Headline';
import LabelField from '../Label/Label';
import InputField from '../Input/Input';
import Text from '../Text/Text';
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import { emailValidation } from '../../tools/validation';
import {
    BrowserRouter as Router,
    Redirect
} from "react-router-dom";
function AddUser(props) {
    const [formState, setState] = useState({
        email: "",
        password: "",
        emailValid: -1,
        successStatus: -1
    }
    );

    const addUser = () => {
        const emailValid = emailValidation(formState.email);
        setState({
            ...formState,
            emailValid: emailValid,
        })
        if (emailValid === 0) {
            axios.post('http://crossfit.com:8005/addUser', {
                email: formState.email,
                token: localStorage.getItem('user_token')
            }).then(function (response) {
                setState({
                    ...formState,
                    successStatus: response.data.status
                })
            })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }
    return (
        <>
            {!localStorage.getItem('user_token') && <Redirect to="/LoginSignup" />} ||
            <div className="box-container">
                <div className="inner-container">

                    <Headline text="Add new user" />
                    <div className="box">
                        <div className="input-group">
                            <LabelField htmlfor="email" text="User email" />
                            <InputField name="email"
                                type="text"
                                className="login-input"
                                placeholder="type employee email"
                                onChange={e =>
                                    setState({
                                        ...formState,
                                        email: e.target.value,
                                        emailValid: 0
                                    })}
                            />
                        </div>
                        {
                            (formState.emailValid === 1 && <ErrorMsg text="Oops! Email address is required" />) ||
                            (formState.emailValid === 2 && <ErrorMsg text="Oops! Invalid email address" />) ||
                            (formState.emailValid === 3 && <ErrorMsg text="Oops, The user already exists" />)
                        }
                        <Text text="We will send your employee invitation email" />
                        <Button
                            className="forgotPass-btn"
                            onClick={addUser}
                            text="Submit"
                        />

                        {formState.successStatus === 1 && <ErrorMsg text="Oops, The user already exists" />}
                        {formState.successStatus === 2 && <ErrorMsg text="Something went wrong, please try again" />}
                        {formState.successStatus === 0 && <Text text="Your employee will get an invitation email soon" />}

                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser;

