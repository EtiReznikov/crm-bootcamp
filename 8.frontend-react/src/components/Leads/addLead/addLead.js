
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import './addLead.scss'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Text from '../../SubComponents/Text/Text'
import { phoneValidation, nameValidation, phoneLengthValidation, nameLengthValidation, emailValidation } from '../../../tools/validation';
function AddLead(props) {
    const [formState, setState] = useState({
        name: props.isFromLandingPage ? props.leadData.name : "",
        phone: props.isFromLandingPage ? (props.leadData.phone === '050' ? "" : props.leadData.phone ) : "",
        email: props.isFromLandingPage ? props.leadData.email : "",
        moreInfo: props.isFromLandingPage ? props.leadData.moreInfo : "",
        gender: props.isFromLandingPage ? props.leadData.gender : "",
        updateConfirm: props.isFromLandingPage ? props.leadData.updatesConfirm : "",
        nameValid: 0,
        phoneValid: 0,
        emailValid: -1,
        selectedPackage: [],
    })
    const [errorMsg, setErrorMsg] = useState(false);
    const [btnActive, setBtnActive] = useState(true);
    const [successMsg, setSuccessMsg] = useState(false);

    /* when add user button is submitted*/
    const onSubmit = (e) => {
        const nameValid = nameLengthValidation(formState.name);
        const phoneValid = phoneLengthValidation(formState.phone);
        const emailValid = emailValidation(formState.email)

        const valid = (nameValid === 0) && (phoneValid === 0) && (emailValid === 0)
        setState({
            ...formState,
            nameValid: nameValid,
            phoneValid: phoneValid,
            emailValid: emailValid
        })
        setErrorMsg(false);
        if (valid) {
            axios.post('http://crossfit.com:8004', {
                name: formState.name,
                phone: formState.phone,
                email: formState.email,
                gender: formState.gender,
                moreInfo: formState.moreInfo,
                updatesConfirm: formState.updateConfirm
            })
                .then(function (response) {
                    console.log(response)
                    if (!response.data.flag) {
                        setErrorMsg(true);
                        setBtnActive(true);
                    } else {
                        setSuccessMsg(true)
                        setBtnActive(true);
                    }
                })
                .catch(function (error) {
                    setErrorMsg(true);
                    setBtnActive(true);
                });
        }
        else {
            setBtnActive(true);
        }
        e.preventDefault();
    }



    return (
        <div className="form_wrapper" id="add-lead">
            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>

            <div className="form_container">
                <div className="title_container">
                    <h2>Add New Lead</h2>
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
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-envelope"></i>
                        </span>
                        <input type="text" name="email" placeholder="Email"
                            value={formState.email}
                            onChange={(e) => {
                                setState({
                                    ...formState,
                                    email: e.target.value,
                                    emailValid: 0
                                })
                            }}
                        />
                    </div>
                    {
                        /* show email error msg if needed */
                        (formState.emailValid === 2 && <ErrorMsg text="Invalid email address" />) ||
                        (formState.emailValid === 1 && <ErrorMsg text="Email address is required" />) ||
                        (formState.emailValid === -1 && <ErrorMsg />)

                    }
                    <div id="gender">
                        <label for="gender" className="color-picker">
                            Gender:
                        </label>
                        <div id="gender-wrapper">
                            <input
                                type="radio"
                                name="gender"
                                class="input"
                                id="male"
                                value="male"
                                checked={formState.gender === 'male'}
                                onClick={(e) => {
                                    setState({
                                        ...formState,
                                        gender: e.target.value
                                    })
                                }}
                            />
                            <label class="gender-pick" for="gender">male</label>
                        </div>
                        <div id="gender-wrapper">
                            <input
                                type="radio"
                                name="gender"
                                class="input"
                                id="female"
                                value="female"
                                checked={formState.gender === 'female'}
                                onClick={(e) => {
                                    setState({
                                        ...formState,
                                        gender: e.target.value
                                    })
                                }}
                            />
                            <label class="gender-pick" for="gender">female</label>
                        </div>
                    </div>
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-info"></i>
                        </span>
                        <textarea id="more-info" type="text" name="more information" placeholder="More information"
                            value={formState.moreInfo}
                            onChange={(e) => {
                                setState({
                                    ...formState,
                                    moreInfo: e.target.value,
                                })
                            }}
                        />
                    </div>
                    <div className="input_field" id="updates" >
                        <input
                            type="checkbox"
                            name="updates"
                            class="input"
                            id="updates"
                            value="updates"
                            checked={formState.updateConfirm}
                            onClick={(e) => {
                                setState({
                                    ...formState,
                                    updateConfirm: !formState.updateConfirm
                                })
                            }}
                        />
                        <label htmlFor="updates" >
                            Confirm to get updates
                        </label>
                    </div>


                    {btnActive && <input className="button" type="submit" value="Submit" disabled={!btnActive}
                        onClick={(e) => {
                            setBtnActive(false);
                            onSubmit(e);
                        }
                        } />}
                    {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}

                    {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                    {!errorMsg && <ErrorMsg />}
                    {!successMsg && <Text />}
                    {successMsg && <Text text="Lead added successfully" />}
                </form>
            </div>
        </div>
    )
}

export default AddLead;

