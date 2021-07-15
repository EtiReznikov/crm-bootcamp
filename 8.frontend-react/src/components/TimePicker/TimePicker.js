import {React, useState} from 'react';
import Headline from '../SubComponents/Headline/Headline';
import './TimePicker.scss'

import { timeValidation, nameLengthValidation, hourValidation, minValidation } from '../../tools/validation';

function TimePicker(props) {
    const [formState, setState] = useState({
        hours: props.isEdit ? props.classData.time.substring(0, 2) : "10",
        minutes: props.isEdit ? props.classData.time.substring(3) : "00",
    }
    );

    const [hhValid, setHHValid] = useState(true);
    const [mmValid, setMMValid] = useState(true);

    const changeHH = (e) => {
        // setHHValid(timeValidation(e.target.value) && hourValidation(e.target.value));
        // setState({
        //     ...formState,
        //     hours: e.target.value
        // })
        props.changeHH(e);
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
        // setState({
        //     ...formState,
        //     hours: hh
        // })
        // props.changeHH();
    }

    const hourDown = () => {
        var hh = parseInt(formState.hours);
        if (hh === 0) hh = 23;
        else hh--;
        if (0 <= hh && hh <= 9)
            hh = '0' + hh;
        // setState({
        //     ...formState,
        //     hours: hh
        // })
        // props.changeHH();
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


    return (

        <div id="time-wrapper" class="time-picker">
            <div id="hour-wrapper">
                <i id="upHH" className="fa fa-chevron-up" onClick={() => {
                    props.setErrorMsg(false);
                    hourUp()
                }}></i>
                {
                    hhValid && <input className="weekday" id="hh-select" placeholder="hh" value={formState.hours} maxLength="2"
                        onChange={e => {
                            props.setErrorMsg(false);
                            changeHH(e);
                        }
                        }></input>}

                {!hhValid && <input className="weekday" id="hh-select-error" placeholder="hh" value={formState.hours} maxLength="2"
                    onChange={e => {
                        props.setErrorMsg(false);
                        changeHH(e);
                    }
                    }></input>
                }
                <i id="downHH" className="fa fa-chevron-down" onClick={() => {
                    props.setErrorMsg(false);
                    hourDown()
                }}></i>
            </div>
            <div id="min-wrapper">
                <i id="upMM" className="fa fa-chevron-up" onClick={() => {
                    props.setErrorMsg(false);
                    minutesUp()
                }}></i>
                {
                    (mmValid && <input className="weekday" id="mm-select" placeholder="mm" value={formState.minutes} maxLength="2"
                        onChange={e => {
                            props.setErrorMsg(false);
                            changeMM(e);
                        }
                        }></input>)
                    ||
                    (!mmValid && <input className="weekday" id="mm-select-error" placeholder="mm" value={formState.minutes} maxLength="2"
                        onChange={e => {
                            props.setErrorMsg(false);
                            changeMM(e);
                        }
                        }></input>)
                }
                <i id="downMM" className="fa fa-chevron-down"
                    onClick={() => {
                        props.setErrorMsg(false);
                        minutesDown()
                    }}></i>
            </div>
        </div>
 
    )
}

export default TimePicker;