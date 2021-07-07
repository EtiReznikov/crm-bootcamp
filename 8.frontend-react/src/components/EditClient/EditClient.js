
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Text from '../Text/Text';
import { emailValidation } from '../../tools/validation';
import '../../Views/Form.scss';
import './AddClient.scss'
import { phoneValidation, nameValidation } from '../../tools/validation';
import {
    Redirect
} from "react-router-dom";
function EditClient(props) {
    
    const [errorMsg, setErrorMsg] = useState(false);

    /* when add user button is submitted*/
    const EditClient = (e) => {
        
    }

    return (
        <div className="form_wrapper">
{/* 
            <button class="exit" onClick={props.closeModal} >
                <i className="fa fa-window-close"></i>
            </button>

            <div className="form_container">
                <div className="title_container">
                    <h2>Edit Client Data</h2>
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
                            })
                        }
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
                                (formState.phoneValid === 1 && <ErrorMsg text="Phone number can only contain digits" />) ||
                                (formState.phoneValid === 2 && <ErrorMsg text="Phone number should exactly 10 digits" />)
                            }
                            <input className="button" type="submit" value="Submit" onClick={
                                AddClient
                            } />
                            {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                            {!errorMsg && <ErrorMsg />}
                        </form>

                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default RemoveClient;

