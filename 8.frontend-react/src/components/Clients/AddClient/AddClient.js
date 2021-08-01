
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import './AddClient.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { phoneValidation, nameValidation, phoneLengthValidation, nameLengthValidation } from '../../../tools/validation';
function AddClient(props) {
    const [formState, setState] = useState({
        name: props.isEdit ? props.clientData.client_name : (props.isFromLandingPage ? props.clientData.name : ""),
        phone: props.isEdit ? props.clientData.client_phone : (props.isFromLandingPage ? (props.clientData.phone === '050' ? "" : props.clientData.phone) : ""),
        nameValid: 0,
        phoneValid: 0,
        selectedPackage: [],
    }
    );
    const [errorMsg, setErrorMsg] = useState(false);
    const [data, setData] = useState([]);
    const [btnActive, setBtnActive] = useState(true);


    async function addClient() {
        axios.post('http://localhost:991/packages/getPackages/', {
            business_id: localStorage.getItem('business_id'),
        })
            .then((response) => {
                let data = []
                for (const packageValue of response.data) {
                    data.push({
                        value: packageValue.package_id,
                        label: packageValue.package_name,
                    })
                }
                setData(data);
            })
            .catch(function (error) {

            });
    }

    useEffect(async () => {
        await addClient();
    }, []);

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
                axios.post('http://localhost:991/clients/editClientData/', {
                    clientId: props.clientData.client_id,
                    clientName: formState.name,
                    clientPhone: formState.phone,
                    // selectedPackage: formState.selectedPackage,
                })
                    .then((response) => {
                        if (response.data === true) {
                            props.closeModal();
                            props.changeDataState();
                        }
                        else {
                            setErrorMsg(true);
                            setBtnActive(true);
                        }

                    })
                    .catch(function (error) {
                        setErrorMsg(true);
                        setBtnActive(true);
                    });
            }
            else {
                axios.post('http://localhost:991/clients/addClient/', {
                    name: formState.name,
                    phone: formState.phone,
                    business_id: localStorage.getItem('business_id'),
                    // selectedPackage: formState.selectedPackage,
                }).then(function (response) {
                    if (response.data === true) {
                        props.closeModal();
                        props.changeDataState();
                    }
                    else {
                        setErrorMsg(true);
                        setBtnActive(true);
                    }
                })
                    .catch(function (error) {
                        setErrorMsg(true);
                        setBtnActive(true);
                    });
            }
        }
        else {
            setBtnActive(true);
        }
        e.preventDefault();
    }



    return (
        <div className="form_wrapper">

            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>

            <div className="form_container">
                <div className="title_container">
                    {props.isEdit ? <h2>Edit Client</h2> : <h2>Add New Client</h2>}
                </div>
                <div className="input_field" >
                    <span>
                        <i aria-hidden="true" className="fa fa-user"></i>
                    </span>
                    <input
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={formState.name}
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
                            value={formState.phone}
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

                    {btnActive && <input className="button" type="submit" value="Submit" disabled={!btnActive}
                        onClick={(e) => {
                            setBtnActive(false);
                            onSubmit(e);
                        }
                        } />}
                    {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}

                    {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                    {!errorMsg && <ErrorMsg />}
                </form>
            </div>
        </div>
    )
}

export default AddClient;

