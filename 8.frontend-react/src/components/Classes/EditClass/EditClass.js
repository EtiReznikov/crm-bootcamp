
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import { timeValidation, nameLengthValidation, hourValidation, minValidation } from '../../../tools/validation';
import 'react-edit-text/dist/index.css';
import { SketchPicker, CirclePicker } from 'react-color';

function EditClass(props) {
    console.log(props)
    // const [errorMsg, setErrorMsg] = useState(false);
    // const [nameValue, setNameValue] = useState(props.clientData.client_name);
    // const [nameValid, setNameValid] = useState(0);
    // const [phoneValue, setPhoneValue] = useState(props.clientData.client_phone);
    // const [phoneValid, setPhoneValid] = useState(0);

    const [formState, setState] = useState({
        className: "",
        classValid: 0,
        classDescription: "",
        classColor: '#E7E7E7',
        hours: '10',
        minutes: '00',
        days: {
            monday: false,
            thursday: false,
            wednesday: false,
            tuesday: false,
            friday: false,
            saturday: false,
            sunday: false
        },
    }
    );


    const [hhValid, setHHValid] = useState(true);
    const [mmValid, setMMValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState(false);


    /* when add user button is submitted*/
    const EditClasses = (e) => {
        // const nameValid = nameLengthValidation(nameValue);
        // const phoneValid = phoneLengthValidation(phoneValue);
        // const valid = (nameValid === 0) && (phoneValid === 0);
        // setErrorMsg(false);
        // if (valid){
        // axios.post('http://localhost:991/clients/editClientData/', {
        //     clientId: props.clientData.client_id,
        //     clientName: nameValue,
        //     clientPhone: phoneValue

        // })
        //     .then((response) => {
        //         console.log(response.data)
        //         if (response.data === true){
        //             props.closeModal();
        //             props.changeDataState();
        //         }
        //         else{
        //             setErrorMsg(true);
        //         }

        //     })
        //     .catch(function (error) {

        //     });
        // }
        // e.preventDefault();
    }

    const changeHH = (e) => {
        setHHValid(timeValidation(e.target.value) && hourValidation(e.target.value));
        setState({
            ...formState,
            hours: e.target.value
        })
    }

    const changeMM = (e) => {
        setMMValid(timeValidation(e.target.value) && minValidation(e.target.value));
        setState({
            ...formState,
            minutes: e.target.value
        })
    }

    const hourUp = () => {
        var hh = parseInt(formState.hours);
        if (hh == 23) hh = 0;
        else hh++;
        if (0 <= hh && hh <= 9)
            hh = '0' + hh;
        setState({
            ...formState,
            hours: hh
        })
    }

    const hourDown = () => {
        var hh = parseInt(formState.hours);
        if (hh == 0) hh = 23;
        else hh--;
        if (0 <= hh && hh <= 9)
            hh = '0' + hh;
        setState({
            ...formState,
            hours: hh
        })
    }

    const minutesUp = () => {
        var mm = parseInt(formState.minutes);
        if (mm == 59) mm = 0;
        else mm++;
        if (0 <= mm && mm <= 9)
            mm = '0' + mm;
        setState({
            ...formState,
            minutes: mm
        })
    }

    const minutesDown = () => {
        var mm = parseInt(formState.minutes);
        if (mm == 0) mm = 59;
        else mm--;
        if (0 <= mm && mm <= 9)
            mm = '0' + mm;
        setState({
            ...formState,
            minutes: mm
        })
    }

    const handleCheckClick = (e, day) => {
        // console.log(e);
        console.log(day.day)
        const days = formState.days
        days[day.day] = !days[day]
        setState({
            ...formState,
            days: days
        })
    }


    return (
        <div className="form_wrapper">

            <button class="exit" onClick={props.closeModal} >
                <i className="fa fa-window-close"></i>
            </button>



            <div className="form_container">
                <div className="title_container">
                    <h2>Add New Class</h2>
                </div>
                <form>
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-user"></i>
                        </span>
                        <input
                            name="className"
                            type="text"
                            placeholder="Class Name"
                            onChange={e =>
                                setState({
                                    ...formState,
                                    className: e.target.value,
                                })
                            }
                        />
                    </div>
                    {(formState.classValid === 2 && <ErrorMsg text="Name must contain at least 2 letters" />)}
                    {formState.classValid === 0 && <ErrorMsg />}
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-user"></i>
                        </span>
                        <textarea
                            name="className"
                            type="text"
                            placeholder="Description"
                            id="class-description"
                            onChange={e =>
                                setState({
                                    ...formState,
                                    classDescription: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="input_field" id="color-wrapper">
                        <label for="color-picker" class="color-picker">
                            Pick A Color:
                        </label>
                        <CirclePicker id="color-picker" circleSize={25} onChange={(e) => {
                            setState({
                                ...formState,
                                color: e.hex
                            })
                        }} />
                    </div>
                    <label for="color-picker" class="color-picker">
                        Pick Date and Time:
                    </label>
                    <div class="weekDays-time-selector">

                        <div id="weekday-wrapper">
                            {
                                ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                                    day => <>
                                        <input type="checkbox" id={`weekday-'${day}'`} class="weekday" value={day}
                                            onClick={(e) => { handleCheckClick(e, { day }) }}
                                        />
                                        <label for={`weekday-'${day}'`}>
                                            {day.charAt(0).toUpperCase()}
                                        </label>
                                    </>
                                )
                            }
                        </div>
                        <div id="time-wrapper">
                            <div id="hour-wrapper">
                                <i id="upHH" class="fa fa-chevron-up" onClick={
                                    hourUp
                                }></i>
                                {
                                    (hhValid && <input class="weekday" id="hh-select" value={formState.hours} placeholder="hh" maxLength="2"
                                        onChange={e => {
                                            changeHH(e);
                                        }
                                        }></input>)
                                    ||
                                    (!hhValid && <input class="weekday" id="hh-select-error" value={formState.hours} placeholder="hh" maxLength="2"
                                        onChange={e => {
                                            changeHH(e);
                                        }
                                        }></input>)
                                }
                                <i id="downHH" class="fa fa-chevron-down" onClick={hourDown}></i>
                            </div>
                            <div id="min-wrapper">
                                <i id="upMM" class="fa fa-chevron-up" onClick={minutesUp}></i>
                                {
                                    (mmValid && <input class="weekday" id="mm-select" value={formState.minutes} placeholder="mm" maxLength="2"
                                        onChange={e => {
                                            changeMM(e);
                                        }
                                        }></input>)
                                    ||
                                    (!mmValid && <input class="weekday" id="mm-select-error" value={formState.minutes} placeholder="mm" maxLength="2"
                                        onChange={e => {
                                            changeMM(e);
                                        }
                                        }></input>)
                                }
                                <i id="downMM" class="fa fa-chevron-down" onClick={minutesDown}></i>
                            </div>
                        </div>
                    </div>


                    <input className="button" type="submit" value="Submit" onClick={
                        EditClass
                    } />
                    {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                    {!errorMsg && <ErrorMsg />}
                </form>
            </div>
        </div>
    )
}

export default EditClass;

