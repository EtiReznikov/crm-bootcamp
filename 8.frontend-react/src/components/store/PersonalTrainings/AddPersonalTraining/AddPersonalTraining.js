
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ErrorMsg from '../../../SubComponents/ErrorMsg/ErrorMsg';
import './AddPersonalTraining.scss'
import '../../../../Views/Form.scss';
import Select from 'react-select';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PayPal from '../../../PayPal/PayPalButton';
import { priceValidation } from '../../../../tools/validation';
import { timeValidation, hourValidation, minValidation } from '../../../../tools/validation';
function AddPersonalTraining(props) {
    const [hhValid, setHHValid] = useState(true);
    const [mmValid, setMMValid] = useState(true);
    const [formState, setState] = useState({
        selectedTrainers: [],
        selectClient: props.fromCalendar ? [] : props.clientData.client_id,
        hours: props.fromCalendar ? (props.slot.start.getHours() < 10 ? "0" + props.slot.start.getHours() : props.slot.start.getHours()) : "10",
        minutes: props.fromCalendar ? (props.slot.start.getMinutes() < 10 ? "0" + props.slot.start.getMinutes() : props.slot.start.getMinutes()) : "00",
        price: 150
    }
    );
    const [startDate, setStartDate] = useState(props.fromCalendar ? props.slot.start : new Date());
    const [errorMsg, setErrorMsg] = useState(false);
    const [data, setData] = useState([]);
    const [btnActive, setBtnActive] = useState(true);
    const [errorTrainer, setErrorTrainer] = useState(false);
    const [errorClient, setErrorClient] = useState(false);

    async function getUsers() {
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
                setData(data);
            })
            .catch(function (error) {

            });
    }
    useEffect(async () => {
        await getUsers();
    }, []);


    const onTrainerSelect = (selectedOptions) => {
        setErrorTrainer(false);
        setState({
            ...formState,
            selectedTrainers: selectedOptions
        })
    }

    const onClientSelect = (selectedOptions) => {
        setErrorClient(false);
        setState({
            ...formState,
            selectedClient: selectedOptions
        })
    }

    /* when add user button is submitted*/
    const onSubmit = (details) => {
        setErrorMsg(false);
        axios.post('http://localhost:991/personalTraining/addPersonalTraining/', {
            userId: formState.selectedTrainers.value,
            clientId: props.fromCalendar ? formState.selectedClient.value : props.clientData.client_id,
            date: new Date(startDate.setHours(formState.hours, formState.minutes, 0)),
            business_id: localStorage.getItem('business_id'),
            totalPrice: formState.price,
            transaction: details.id,
            createTime: details.create_time


        })
            .then(function (response) {
                if (response.data === true) {
                    props.setPaymentSuccess(1);
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


    return (
        <div className="form_container" id="personal-training-form">
            <form>
                {props.fromCalendar &&
                    <div className="input_field" id="trainer-select">
                        <label className="classes-picker">
                            Pick Client:
                        </label>
                        <Select name="client" isSearchable={true} value={formState.selectedClient} onChange={onClientSelect} options={props.clients} className="client-selector"
                            classNamePrefix="select" />
                        {errorClient && <ErrorMsg text="You must choose a client" />}
                        {!errorClient && <ErrorMsg />}
                    </div>}
                <div className="input_field" id="trainer-select">
                    <label className="classes-picker">
                        Pick Trainer:
                    </label>
                    <Select name="trainer" isSearchable={true} value={formState.selectedTrainers} onChange={onTrainerSelect} options={data} className="trainer-selector"
                        classNamePrefix="select" />
                    {errorTrainer && <ErrorMsg text="You must choose a trainer" />}
                    {!errorTrainer && <ErrorMsg />}
                </div>
                <div className="input_field" id="price-picker" >
                    <span>
                        <i aria-hidden="true" className="fa fa-shekel"></i>
                    </span>
                    <input
                        name="price"
                        type="text"
                        placeholder="Price per month"
                        value={formState.price}
                        onChange={
                            e =>
                                setState({
                                    ...formState,
                                    price: e.target.value,
                                })
                        }
                        onKeyUp={
                            e => {
                                setState({
                                    ...formState, priceValid: priceValidation(e.target.value)
                                })
                            }
                        }
                    />
                </div>
                <div className="input_field" >
                    <label className="classes-picker">
                        Pick Date and Time:
                    </label>
                    <div id="date-time-wrapper">
                        <DatePicker dateFormat="dd-MM-yyyy" selected={startDate} onChange={(date) => setStartDate(date)} />
                        <div id="time-wrapper">
                            <div id="hour-wrapper">
                                <i id="upHH" className="fa fa-chevron-up" onClick={() => {
                                    setErrorMsg(false);
                                    hourUp()
                                }}></i>
                                {
                                    (hhValid && <input className="weekday" id="hh-select" placeholder="hh" value={formState.hours} maxLength="2"
                                        onChange={e => {
                                            setErrorMsg(false);
                                            changeHH(e);
                                        }
                                        }></input>)

                                    ||
                                    (!hhValid && <input className="weekday" id="hh-select-error" placeholder="hh" value={formState.hours} maxLength="2"
                                        onChange={e => {
                                            setErrorMsg(false);
                                            changeHH(e);
                                        }
                                        }></input>)
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
                </div>
                {formState.selectedTrainers.length !== 0 && <PayPal btnActive={btnActive} totalPrice={formState.price} onSubmit={onSubmit} />}
                {formState.selectedTrainers.length === 0 && <ErrorMsg className="above-payPal" text="please fill all fields" />}

                {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                {!errorMsg && <ErrorMsg />}

            </form>
        </div>
    )
}

export default AddPersonalTraining;

