
import axios from 'axios';
import React, { useState, PropTypes } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import './AddClass.scss'
import { CirclePicker } from 'react-color';
import 'material-design-inspired-color-picker'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


import { timeValidation, nameLengthValidation, hourValidation, minValidation } from '../../../tools/validation';
function AddClass(props) {
    const daysObjTemp = {};
    if (props.isEdit) {
        const daysTemp = props.classData.days.split(', ');
        for (let day of daysTemp) {
            daysObjTemp[day] = true;
        }
    }
    const [formState, setState] = useState({
        className: props.isEdit ? props.classData.class_name : "",
        classValid: 0,
        classDescription: props.isEdit ? props.classData.description : "",
        classColor: props.isEdit ? props.classData.color : "#2196f3",
        hours: props.isEdit ? props.classData.time.substring(0, 2) : "10",
        minutes: props.isEdit ? props.classData.time.substring(3) : "00",
        days: {
            monday: props.isEdit && daysObjTemp.monday ? daysObjTemp.monday : false,
            thursday: props.isEdit && daysObjTemp.thursday ? daysObjTemp.thursday : false,
            wednesday: props.isEdit && daysObjTemp.wednesday ? daysObjTemp.wednesday : false,
            tuesday: props.isEdit && daysObjTemp.tuesday ? daysObjTemp.tuesday : false,
            friday: props.isEdit && daysObjTemp.friday ? daysObjTemp.friday : false,
            saturday: props.isEdit && daysObjTemp.saturday ? daysObjTemp.saturday : false,
            sunday: props.isEdit && daysObjTemp.sunday ? daysObjTemp.sunday : false,
        },
    }
    );

    const [hhValid, setHHValid] = useState(true);
    const [mmValid, setMMValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState(false);
    const [btnActive, setBtnActive] = useState(true);


    const onSubmit = (e) => {
        const nameValid = nameLengthValidation(formState.className);
        setState({
            ...formState,
            classValid: nameValid,
        })
        setErrorMsg(false);
        if (nameValid === 0) {
            if (props.isEdit) {
                axios.post('http://localhost:991/classes/editClassData/', {
                    className: formState.className,
                    classDescription: formState.classDescription,
                    color: formState.classColor,
                    classId: props.classData.class_id,
                    dayAndTime: JSON.stringify({
                        hours: formState.hours,
                        min: formState.minutes,
                        days: chosenDays()
                    })
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
            else {
                axios.post('http://localhost:991/classes/addClass/', {
                    className: formState.className,
                    classDescription: formState.classDescription,
                    color: formState.classColor,
                    business_id: localStorage.getItem('business_id'),

                    dayAndTime: JSON.stringify({
                        hours: formState.hours,
                        min: formState.minutes,
                        days: chosenDays()
                    })
                }).then(function (response) {
                    if (response.data === true) {
                        props.closeModal();
                        props.changeDataState();
                    }
                    else {
                        console.log("error")
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
        if (hh === 23) hh = 0;
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
        if (hh === 0) hh = 23;
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
        if (mm === 59) mm = 0;
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
        if (mm === 0) mm = 59;
        else mm--;
        if (0 <= mm && mm <= 9)
            mm = '0' + mm;
        setState({
            ...formState,
            minutes: mm
        })
    }

    const handleCheckClick = (e, day) => {
        const days = formState.days
        days[day.day] = !days[day.day]
        setState({
            ...formState,
            days: days
        })
    }

    const chosenDays = () => {
        //obj to array
        let daysArrays = Object.entries(formState.days);
        //map only chosen days
        let isTrue = daysArrays.filter(([key, value]) => value);
        //array to object
        let daysObj = Object.fromEntries(isTrue);
        //return only keys
        return Object.keys(daysObj);
    }
    return (
        <div className="form_wrapper">
            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>

            <div className="form_container">
                <div className="title_container">
                    {props.isEdit ? <h2>Edit Class</h2> : <h2>Add New Class</h2>}
                </div>
                <form>
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-object-ungroup"></i>
                        </span>
                        <input
                            name="className"
                            type="text"
                            placeholder="Class Name"
                            value={formState.className}
                            onChange={e => {
                                setErrorMsg(false);
                                setState({
                                    ...formState,
                                    className: e.target.value,
                                })
                            }
                            }
                        />
                    </div>
                    {(formState.classValid === 2 && <ErrorMsg text="Name must contain at least 2 letters" />)}
                    {formState.classValid === 0 && <ErrorMsg />}
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-pencil"></i>
                        </span>
                        <textarea
                            name="className"
                            type="text"
                            placeholder="Description"
                            id="class-description"
                            value={formState.classDescription}
                            onChange={e => {
                                setErrorMsg(false);
                                setState({
                                    ...formState,
                                    classDescription: e.target.value,
                                })
                            }
                            }
                        />
                    </div>
                    <div className="input_field" id="color-wrapper">
                        <label for="color-picker" className="color-picker">
                            Pick A Color:
                        </label>
                        <CirclePicker id="color-picker" color={formState.classColor} circleSize={25}
                            onChange={(e) => {
                                setErrorMsg(false);
                                setState({
                                    ...formState,
                                    classColor: e.hex
                                })
                            }} />
                    </div>
                    {/* <div>
                        <GooglePlacesAutocomplete
                            apiKey='AIzaSyC0LnvgDzKrHvGI1WcBdKmQX1peUH1ODq4'
                        />
                    </div> */}
                    <label for="color-picker" className="color-picker">
                        Pick Date and Time:
                    </label>
                    <div className="weekDays-time-selector">

                        <div id="weekday-wrapper">
                            {
                                ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                                    day =>
                                        <>
                                            <input type="checkbox" id={`weekday-'${day}'`} className="weekday" value={day} checked={formState.days[day]}
                                                onChange={(e) => {
                                                    setErrorMsg(false);
                                                    handleCheckClick(e, { day })
                                                }}
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
                                <i id="upHH" className="fa fa-chevron-up" onClick={() => {
                                    setErrorMsg(false);
                                    hourUp()
                                }}></i>
                                {
                                    hhValid && <input className="weekday" id="hh-select" placeholder="hh" value={formState.hours} maxLength="2"
                                        onChange={e => {
                                            setErrorMsg(false);
                                            changeHH(e);
                                        }
                                        }></input>}

                                {!hhValid && <input className="weekday" id="hh-select-error" placeholder="hh" value={formState.hours} maxLength="2"
                                    onChange={e => {
                                        setErrorMsg(false);
                                        changeHH(e);
                                    }
                                    }></input>
                                }
                                <i id="downHH" className="fa fa-chevron-down" onClick={() => {
                                    setErrorMsg(false);
                                    hourDown()
                                }}></i>
                            </div>
                            <div id="min-wrapper">
                                <i id="upMM" className="fa fa-chevron-up" onClick={() => {
                                    setErrorMsg(false);
                                    minutesUp()
                                }}></i>
                                {
                                    (mmValid && <input className="weekday" id="mm-select" placeholder="mm" value={formState.minutes} maxLength="2"
                                        onChange={e => {
                                            setErrorMsg(false);
                                            changeMM(e);
                                        }
                                        }></input>)
                                    ||
                                    (!mmValid && <input className="weekday" id="mm-select-error" placeholder="mm" value={formState.minutes} maxLength="2"
                                        onChange={e => {
                                            setErrorMsg(false);
                                            changeMM(e);
                                        }
                                        }></input>)
                                }
                                <i id="downMM" className="fa fa-chevron-down"
                                    onClick={() => {
                                        setErrorMsg(false);
                                        minutesDown()
                                    }}></i>
                            </div>
                        </div>
                    </div>

                    {btnActive && <input className="button" type="submit" value="Submit" disabled={!btnActive}
                        onClick={(e) => {
                            setBtnActive(false);
                            onSubmit(e);
                        }
                        } />}
                    {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}
                    {/* <input className="button" type="submit" value="Submit" onClick={
                        onSubmit
                    } /> */}
                    {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                    {!errorMsg && <ErrorMsg />}
                </form>


            </div>
        </div>
    )
}

export default AddClass;

