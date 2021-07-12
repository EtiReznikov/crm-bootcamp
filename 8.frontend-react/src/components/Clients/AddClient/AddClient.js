
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import './AddClient.scss'
import { phoneValidation, nameValidation, phoneLengthValidation, nameLengthValidation } from '../../../tools/validation';
function AddClient(props) {
    console.log(props)
    const [formState, setState] = useState({
        name: props.isEdit ? props.classData.name : "",
        phone: props.isEdit ? props.classData.phone : "",
        nameValid: 0,
        phoneValid: 0,
    }
    );
    const [errorMsg, setErrorMsg] = useState(false);

    /* when add user button is submitted*/
    const onSubmit = (e) => {

        const nameValid = nameLengthValidation(formState.name);
        const phoneValid = phoneLengthValidation(formState.phone);
        const valid = (nameValid === 0) && (phoneValid === 0);
        setState({
            ...formState,
            nameValid: nameValid,
            phoneValid: phoneValid
        })
        setErrorMsg(false);
        if (valid) {
            if (props.isEdit) {

            }
            else {
                axios.post('http://localhost:991/clients/addClient/', {
                    name: formState.name,
                    phone: formState.phone,
                    business_id: localStorage.getItem('business_id'),
                }).then(function (response) {
                    if (response.data === true) {
                        props.closeModal();
                        props.changeDataState();
                    }
                    else {
                        setErrorMsg(true);
                    }
                })
                    .catch(function (error) {
                        console.log(error)
                    });
            }
        }
        e.preventDefault();
    }

    return (
        <div className="form_wrapper">

            <button class="exit" onClick={props.closeModal} >
                <i className="fa fa-window-close"></i>
            </button>

            <div className="form_container">
                <div className="title_container">
                   { props.isEdit ?  <h2>Edit Client</h2> : <h2>Add New Client</h2>}
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
                        onSubmit
                    } />
                    {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                    {!errorMsg && <ErrorMsg />}
                </form>
            </div>
        </div>
    )
}

export default AddClient;

