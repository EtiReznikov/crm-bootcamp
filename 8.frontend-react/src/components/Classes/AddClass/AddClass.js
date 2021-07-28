
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import './AddClass.scss'
import { CirclePicker } from 'react-color';
import 'material-design-inspired-color-picker'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import LocationSearchInput from '../../Map/LocationSearchInput/LocationSearchInput';
import Select from 'react-select';

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
        selectedTrainer: []
    })

    const [location, setLocation] = useState(props.isEdit ? JSON.parse(props.classData.location) : { address: "" });
    const [hhValid, setHHValid] = useState(true);
    const [mmValid, setMMValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState(false);
    const [btnActive, setBtnActive] = useState(true);
    const [trainers, setTrainers] = useState([]);
    const [errorTrainer, setErrorTrainer] = useState(false);

    useEffect(() => {
        (async () => {
            await axios.post('http://crossfit.com:8005/Accounts/getUsersList', {
                businessId: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    let data = []
                    for (const userValue of response.data) {
                        if (userValue.permission_id === 1)
                            data.push({
                                value: userValue.user_id,
                                label: userValue.user_name,
                            })
                    }
                    setTrainers(data);
                })
                .catch(function (error) {

                });
            if (props.isEdit) {
                await axios.post('http://localhost:991/classes/getTrainerOfClass/', {
                    classId: props.classData.class_id,
                })
                    .then((response) => {
                        let trainer = []
                        for (const trainerValue of response.data) {
                            trainer.push({
                                value: trainerValue.user_id,
                                label: trainerValue.user_name,
                            })
                        }
                        setState({
                            ...formState,
                            selectedTrainer: trainer
                        })
                    })
                    .catch(function (error) {

                    });
            }
        })();
    }, []);


    const onTrainerSelect = (selectedOptions) => {
        setErrorTrainer(false);
        setState({
            ...formState,
            selectedTrainer: selectedOptions
        })
    }

    const onSubmit = (e) => {
        if (formState.selectedTrainer.length === 0) {
            setErrorTrainer(true);
            setBtnActive(true);
        }
        else {
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
                        trainer: formState.selectedTrainer[0].value,
                        dayAndTime: JSON.stringify({
                            hours: formState.hours,
                            min: formState.minutes,
                            days: chosenDays()
                        }),
                        location: JSON.stringify(location),

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
                        }),
                        location: JSON.stringify(location),
                        trainer: formState.selectedTrainer.value
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
        }
        e.preventDefault();
    }
    const onLocationChange = (location) => {
        setLocation(location)
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
        let hh = parseInt(formState.hours);
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
        let hh = parseInt(formState.hours);
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
        let mm = parseInt(formState.minutes);
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
        let mm = parseInt(formState.minutes);
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

    const createDayList = () => {
        let days = [];
        days[0] = "monday";
        days[1] = "tuesday";
        days[2] = "wednesday";
        days[3] = "thursday";
        days[4] = "friday";
        days[5] = "saturday";
        days[6] = "sunday";
        return days;
    }
    return (
        <div className="form_wrapper" id="add-class">
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
                                    classValid: 0
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
                    <div className="input_field" >
                        <label className="classes-picker">
                            Pick Trainer:
                        </label>
                        <Select name="trainer" isSearchable={true} value={formState.selectedTrainer} onChange={onTrainerSelect} options={trainers} className="trainer-selector"
                            classNamePrefix="select" />
                        {errorTrainer && <ErrorMsg text="You must choose a trainer" />}
                        {!errorTrainer && <ErrorMsg />}
                    </div>
                    <div className="input_field" id="color-wrapper">
                        <label htmlFor="color-picker" className="color-picker">
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
                    <LocationSearchInput onLocationChange={onLocationChange} address={location.address} />
                    <label htmlFor="color-picker" className="color-picker">
                        Pick Date and Time:
                    </label>
                    <div className="weekDays-time-selector">

                        <div id="weekday-wrapper">
                            {
                                createDayList().map(
                                    (day, key) =>
                                        <>
                                            <input type="checkbox" id={`weekday-'${day}'`} className="weekday" value={day} checked={formState.days[day]}
                                                onChange={(e) => {
                                                    setErrorMsg(false);
                                                    handleCheckClick(e, { day })
                                                }}
                                            />
                                            <label htmlFor={`weekday-'${day}'`}>
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

