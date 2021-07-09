
import axios from 'axios';
import React, { useState} from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import './EditClient.scss'
import { phoneValidation, nameValidation , nameLengthValidation, phoneLengthValidation} from '../../../tools/validation';
import 'react-edit-text/dist/index.css';

function EditClient(props) {

    const [errorMsg, setErrorMsg] = useState(false);
    const [nameValue, setNameValue] = useState(props.clientData.client_name);
    const [nameValid, setNameValid] = useState(0);
    const [phoneValue, setPhoneValue] = useState(props.clientData.client_phone);
    const [phoneValid, setPhoneValid] = useState(0);
    

    /* when add user button is submitted*/
    const EditClient = (e) => {
        const nameValid = nameLengthValidation(nameValue);
        const phoneValid = phoneLengthValidation(phoneValue);
        const valid = (nameValid === 0) && (phoneValid === 0);
        setErrorMsg(false);
        if (valid){
        axios.post('http://localhost:991/clients/editClientData/', {
            clientId: props.clientData.client_id,
            clientName: nameValue,
            clientPhone: phoneValue
            
        })
            .then((response) => {
                console.log(response.data)
                if (response.data === true){
                    props.closeModal();
                    props.changeDataState();
                }
                else{
                    setErrorMsg(true);
                }

            })
            .catch(function (error) {

            });
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
                    <h2>Edit Client</h2>
                </div>
                <form>
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-user"></i>
                        </span>

                        <input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={nameValue}
                            onChange={e => setNameValue(e.target.value)}
                            onKeyUp={e => {
                                setNameValid(nameValidation(e.target.value))

                            }}
                        />

                    </div>
                    {nameValid === 1 && <ErrorMsg text="Name can only contain letters and spaces" />}
                    {nameValid === 2 && <ErrorMsg text="Name must contain at least 2 letters" />}
                    {nameValid === 0 && <ErrorMsg />}
                    {/* <div className="row clearfix"> */}
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-phone">
                            </i></span>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={phoneValue}
                            onChange={e =>
                                setPhoneValue(e.target.value)}
                            onKeyUp={e => {
                                setPhoneValid(phoneValidation(e.target.value))
                            }
                            }
                        />
                    </div>
                    {
                        (phoneValid === 0 && <ErrorMsg />) ||
                        (phoneValid === 1 && <ErrorMsg text="Phone number can only contain digits" />) ||
                        (phoneValid === 2 && <ErrorMsg text="Phone number should exactly 10 digits" />)
                    }
                    <input className="button" type="submit" value="Submit" onClick={
                        EditClient
                    } />
                    {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                    {!errorMsg && <ErrorMsg />}
                </form>
            </div>
        </div>


    )
}

export default EditClient;

