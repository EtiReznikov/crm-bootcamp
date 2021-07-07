
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Text from '../Text/Text';
import { emailValidation } from '../../tools/validation';
import '../../Views/Form.scss';
import { phoneValidation, nameValidation } from '../../tools/validation';
import {
    Redirect
} from "react-router-dom";
function AddClient(props) {
    const [formState, setState] = useState({
        name: "",
        phone: "",
        nameValid: 0,
        phoneValid: 0,
    }
    );

    /* when add user button is submitted*/
    const AddClient = (e) => {
        axios.post('http://localhost:991/clients/addClient/', {
            name: formState.name,
            phone: formState.phone,
            business_id: 10,
        }).then(function (response) {
            console.log(response)
        })
            .catch(function (error) {
                console.log(error)
            });
            e.preventDefault();
    }

    return (
        <div className="form_wrapper">
            <div className="form_container">
                <div className="title_container">
                    <h2>Add New Client</h2>
                </div>
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
                {formState.nameValid === 1 && <ErrorMsg text="Name can only contain letters and spaces" />}
                {(formState.nameValid === 2 && <ErrorMsg text="Name must contain at least 2 letters" />)}
                {formState.nameValid === 0 && <ErrorMsg />}
                <div className="row clearfix">
                    <div className="">
                        <form>
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
                                (formState.phoneValid === 0 && <ErrorMsg />) ||
                                (formState.phoneValid === 1 && <ErrorMsg text="Phone number should contain only numbers" />) ||
                                (formState.phoneValid === 2 && <ErrorMsg text="Phone number should exactly 10 digits" />)
                            }
                            <input className="button" type="submit" value="Submit" onClick={AddClient} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddClient;

