
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import '../../../Views/Form.scss';
import '../AddPackage/AddPackage.scss';
import Select from 'react-select';
import { priceValidation, nameValidation, nameLengthValidation } from '../../../tools/validation';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
function AddPackage(props) {
    const [formState, setState] = useState({
        name: props.isEdit ? props.packageData.package_name : "",
        price: props.isEdit ? props.packageData.price : 200,
        nameValid: 0,
        priceValid: true,
        selectedClasses: []
    }
    );
    const [errorMsg, setErrorMsg] = useState(false);
    const [data, setData] = useState([]);
    const [btnActive, setBtnActive] = useState(true);
    const [errorClass, setErrorClass] = useState(false);

    async function getClasses () {
        await axios.post('http://localhost:991/classes/getClasses/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    let data = []
                    for (const classValue of response.data) {
                        data.push({
                            value: classValue.class_id,
                            label: classValue.class_name,
                        })
                    }
                    setData(data);
                })
                .catch(function (error) {

                });
    }

    async function getClassesByPackage(){
        if (props.isEdit) {
            await axios.post('http://localhost:991/packagesClasses/getClassesByPackage/', {
                package_id: props.packageData.package_id,
            })
                .then((response) => {
                    let classes = []
                    for (const classValue of response.data) {
                        classes.push({
                            value: classValue.class_id,
                            label: classValue.class_name,
                        })
                    }
                    setState({
                        ...formState,
                        selectedClasses: classes
                    })
                })
                .catch(function (error) {

                });
        }
    }

    useEffect(async () => {
       await getClasses();
       await getClassesByPackage();
    }, []);


    const onClassesSelect = (selectedOptions) => {
        setState({
            ...formState,
            selectedClasses: selectedOptions
        })
    }

    /* when add user button is submitted*/
    const onSubmit = (e) => {
        if (formState.selectedClasses.length === 0) {
            setErrorClass(true);
            setBtnActive(true);
        }
        else {
            const nameValid = nameLengthValidation(formState.name);
            // const phoneValid = phoneLengthValidation(formState.phone);
            const valid = (nameValid != 2) && (formState.priceValid);
            setState({
                ...formState,
                nameValid: nameValid,
            })

            setErrorMsg(false);
            if (valid) {
                if (props.isEdit) {
                    axios.post('http://localhost:991/packages/editPackageData/', {
                        packageId: props.packageData.package_id,
                        name: formState.name,
                        price: formState.price,
                        selectedClasses: formState.selectedClasses,
                    })
                        .then(function (response) {
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
                            console.log(error)
                        });

                }
                else {

                    axios.post('http://localhost:991/packages/addPackage/', {
                        name: formState.name,
                        price: formState.price,
                        selectedClasses: formState.selectedClasses,
                        business_id: localStorage.getItem('business_id'),
                    }).then(function (response) {
                        if (response.data === true) {
                            props.closeModal();
                            props.changeDataState();
                        }
                        else {
                            setErrorMsg(true);
                            setBtnActive(true);
                            //             setErrorMsg(true);
                        }
                    })
                        .catch(function (error) {
                            setErrorMsg(true);
                            setBtnActive(true);
                            console.log(error)
                        });
                }
            }
            else {
                setErrorMsg(true);
                setBtnActive(true);
            }
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
                    {props.isEdit ? <h2>Edit Package</h2> : <h2>Add New Package</h2>}
                </div>
                <form>
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-cube"></i>
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
                    {(formState.nameValid === 2 && <ErrorMsg text="Name must contain at least 2 letters" />)}
                    {formState.nameValid === 0 && <ErrorMsg />}
                    <div className="input_field" >
                        <label className="classes-picker">
                            Pick Classes:
                        </label>

                        <Select isMulti name="classes" isSearchable={true} value={formState.selectedClasses} onChange={onClassesSelect} options={data} className="class-selector"
                            classNamePrefix="select" />
                    </div>
                    {errorClass && <ErrorMsg text="You must choose package" />}
                    {!errorClass && <ErrorMsg />}
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
                    {(!formState.priceValid && <ErrorMsg text="Price should be a positive number" />)}
                    {formState.priceValid && <ErrorMsg />}
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

export default AddPackage;

