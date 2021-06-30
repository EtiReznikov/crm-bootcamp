
import axios from 'axios';
import React, { useState } from 'react';
import Headline from '../Headline/Headline';
import LabelField from '../Label/Label';
import InputField from '../Input/Input';
import Button from '../Button/Button';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Text from '../Text/Text';
import { emailValidation } from '../../tools/validation';
import './AddUser.scss'
import {
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

    /* when add user button is submitted*/
    const addUser = () => {
        //Check email validation
        const emailValid = emailValidation(formState.email);
        setState({
            ...formState,
            emailValid: emailValid,
        })
        //only if email is valid
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

                });
        }
    }
    return (
        <>
            {!localStorage.getItem('user_token') && <Redirect to="/LoginSignup" />}
            <div className="box-container">
                <div className="inner-container">
                    <Headline className="head-form" text="Add new user" />
                    <div className="box-addUser">
                        <div>
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
                            /* show email error msg if needed */
                            (formState.emailValid === 1 && <ErrorMsg text="Oops! Email address is required" />) ||
                            (formState.emailValid === 2 && <ErrorMsg text="Oops! Invalid email address" />)
                        }
                        </div>
                        <Text className="form-text" text="Your employee will get an invitation to his email address."></Text>
                        <Button
                            className="forgotPass-btn"
                            onClick={addUser}
                            text="Submit"
                        />
                        {/**show error msg if needed */}
                        {formState.successStatus === 1 && <ErrorMsg text="Oops, The user already exists" />}
                        {formState.successStatus === 2 && <ErrorMsg text="Something went wrong, please try again" />}
                        {formState.successStatus === 0 && <Redirect to={{
                            pathname: "/msgPage",
                            state: {
                                headLine: "Your employee will get an invitation soon.",
                                link: "/",
                                aText: "Back to home page"
                            }
                        }} />}

                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser;

