
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import Text from '../../SubComponents/Text/Text';
import { emailValidation } from '../../../tools/validation';
import '../../../Views/Form.scss'
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
    const addUser = (e) => {
        //Check email validation
        const emailValid = emailValidation(formState.email);
        setState({
            ...formState,
            emailValid: emailValid,
        })
        //only if email is valid
        if (emailValid === 0) {
            axios.post('http://crossfit.com:8005/Accounts/addUser', {
                email: formState.email,
                token: localStorage.getItem('user_token'),
                headers: { authentication: localStorage.getItem('user_token') }
            }).then(function (response) {
                setState({
                    ...formState,
                    successStatus: response.data.status
                })
                props.changeDataState();
            })
                .catch(function (error) {
                    setState({
                        ...formState,
                        successStatus: error.response.data.status
                    })
                    //Middle ware ware fails
                    // if (error.response.data.status === 10) {
                    //     localStorage.removeItem('user_token');
                    //     localStorage.removeItem('business_id');
                    // }
                });
        }
       
        e.preventDefault();
    }
    return (
        <div className="form_wrapper">
            {!localStorage.getItem('user_token') && <Redirect to="/loginSignup" />}
            <div className="form_container">
                <div className="title_container">
                    <h2>Add New User</h2>
                </div>
               
                        <form>

                            <div className="input_field">
                                <span>
                                    <i aria-hidden="true" className="fa fa-envelope"></i>
                                </span>
                                <input type="text" name="email" placeholder="Email" onChange={e =>
                                    setState({
                                        ...formState,
                                        email: e.target.value,
                                        emailValid: 0
                                    })}
                                />
                            </div>
                            <Text className="form-text" text="Your employee will get an invitation to his email address."></Text>
                            {
                                /* show email error msg if needed */
                                (formState.emailValid === 2 && <ErrorMsg text="Invalid email address" />) ||
                                (formState.emailValid === 1 && <ErrorMsg text="Email address is required" />) ||
                                (formState.emailValid === -1 && <ErrorMsg />)

                            }
                            {formState.successStatus === -1 && <ErrorMsg />}
                            {formState.successStatus === 1 && <ErrorMsg text="The user already exists" />}
                            <input className="button" type="submit" value="Submit" onClick={addUser} />
                        </form>
                    </div>
              
            {formState.successStatus === 0 && <Redirect to={{
                pathname: "/msgPage",
                state: {
                    icon: "fa fa-check-circle",
                    headLine: "Your employee will get an invitation soon.",
                    link: "/",
                    aText: "Back to home page"
                }
            }} />}
            {formState.successStatus === 2 && <Redirect to={{
                pathname: "/msgPage",
                state: {
                    headLine: "Your employee will get an invitation soon.",
                    link: "/",
                    aText: "Back to home page"
                }
            }} />}
            {formState.successStatus === 10 && <Redirect to={{
                pathname: "/msgPage",
                state: {
                    headLine: "Something went wrong",
                    text_1: "please ",
                    link: "/LoginSignUp",
                    aText: "click here",
                    text_2: "to Login"
                }
            }} />
            }
        </div>
    )
}

export default AddUser;

