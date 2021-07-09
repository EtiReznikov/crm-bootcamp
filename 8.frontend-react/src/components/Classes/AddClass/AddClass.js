
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import './AddClass.scss'
import { SketchPicker, CirclePicker } from 'react-color';
import TimePicker from 'react-time-picker/dist/entry.nostyle';

import { phoneValidation, nameValidation, phoneLengthValidation, nameLengthValidation } from '../../../tools/validation';
function AddClass(props) {
    const [formState, setState] = useState({
        className: "",
        classValid: 0,
        classDescription: "",
        classColor: '#E7E7E7',
        day: 'monday',
        hours: '10',
        minutes: '00'
    }
    );
    const [errorMsg, setErrorMsg] = useState(false);
    // const [errorMsg, setErrorMsg] = useState(false);

    // /* when add user button is submitted*/
    const AddClient = (e) => {
        const nameValid = nameLengthValidation(formState.name);
        setState({
            ...formState,
            nameValid: nameValid,
        })
        setErrorMsg(false);
        if (nameValid === 0) {
            axios.post('http://localhost:991/classes/addClass/', {
                className: formState.className,
                classDescription: formState.classDescription,
                color: formState.color,
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
        e.preventDefault();
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
                    {(formState.classNameValid === 2 && <ErrorMsg text="Name must contain at least 2 letters" />)}
                    {formState.classNameValid === 0 && <ErrorMsg />}
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-user"></i>
                        </span>
                        <textarea
                            name="className"
                            type="text"
                            placeholder="Description"
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
                            Pick A Color
                        </label>
                        <CirclePicker id="color-picker" circleSize={25} onChange={(e) => {
                            setState({
                                ...formState,
                                color: e.hex
                            })
                        }} />
                    </div>

                    {/* <div class="weekDays-selector">
                        <input type="checkbox" id="weekday-mon" class="weekday" />
                        <label for="weekday-mon">M</label>
                        <input type="checkbox" id="weekday-tue" class="weekday" />
                        <label for="weekday-tue">T</label>
                        <input type="checkbox" id="weekday-wed" class="weekday" />
                        <label for="weekday-wed">W</label>
                        <input type="checkbox" id="weekday-thu" class="weekday" />
                        <label for="weekday-thu">T</label>
                        <input type="checkbox" id="weekday-fri" class="weekday" />
                        <label for="weekday-fri">F</label>
                        <input type="checkbox" id="weekday-sat" class="weekday" />
                        <label for="weekday-sat">S</label>
                        <input type="checkbox" id="weekday-sun" class="weekday" />
                        <label for="weekday-sun">S</label>

                        <input class="weekday" id="hh-select" value={formState.hours} placeholder="hh"></input>
                        <input class="weekday" id="mm-select" value={formState.minutes} placeholder="mm"></input>
                    </div> */}
                    

                    <input className="button" type="submit" value="Submit" onClick={
                        AddClass
                    } />
                    {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                    {!errorMsg && <ErrorMsg />}
                </form>


            </div>
        </div>
    )
}

export default AddClass;

