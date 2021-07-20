
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import './PackageSell.scss'
import '../../../Views/Form.scss';
import Select from 'react-select';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { diffDate } from '../../../tools/dateCalculate'
import Text from '../../SubComponents/Text/Text';
import PayPal from '../../PayPal/PayPalButton'
function PackageSell(props) {

    const [formState, setState] = useState({
        selectedPackage: [],
    })
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date((new Date()).setDate(new Date().getDate() + 1)));
    const [errorMsg, setErrorMsg] = useState(false);
    const [data, setData] = useState([]);
    const [errorPackage, setErrorPackage] = useState(false);
    const [dateDiff, setDateDiff] = useState(diffDate(startDate, endDate))
    const [errorDate, setErrorDate] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
   

    useEffect(() => {
        (async () => {
            await axios.post('http://localhost:991/packages/getPackages/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    let data = []
                    for (const packageValue of response.data) {
                        data.push({
                            value: packageValue.package_id,
                            label: packageValue.package_name,
                            price: packageValue.price
                        })
                    }
                    setData(data);
                })
                .catch(function (error) {

                });
        })();
    },[]);



    useEffect(() => {

        setDateDiff(diffDate(startDate, endDate))
        setErrorDate(dateDiff <= 0)


    }, [startDate, endDate, dateDiff]);

    useEffect(() => {

        setTotalPrice(Math.round(formState.selectedPackage.price / (365.2425 / 12) * dateDiff))

    }, [dateDiff, formState.selectedPackage]);

    const onPackagesSelect = (selectedOptions) => {
        setErrorPackage(false);
        setState({
            ...formState,
            selectedPackage: selectedOptions
        })

    }


    const onSubmit = (details) => {
      

        axios.post('http://localhost:991/packageClient/addPackageSell/', {
            packageId: formState.selectedPackage.value,
            clientId: props.clientData.client_id,
            startDate: startDate,
            endDate: endDate,
            totalPrice: totalPrice,
            transaction: details.id,
            createTime: details.create_time
        })
            .then(function (response) {
                if (response.data === true) {
                    // props.closeModal();
                    props.setPaymentSuccess(1);
                    props.changeDataState();
                }
                else {
                    setErrorMsg(true);
                }
            })
            .catch(function (error) {
                setErrorMsg(true);
                console.log(error)
            });

        // }

        // e.preventDefault();
    }


    const onError = () => {

    }

    return (
        <div className="form_container" id="personal-training-form">
            <form>
                <div className="input_field" id="package-select" >
                    <label className="classes-picker">
                        Pick Package:
                    </label>
                    <Select name="packages" isSearchable={true} value={formState.selectedPackage[0]} onChange={onPackagesSelect} options={data} className="package-selector"
                        classNamePrefix="select" />
                </div>
                {errorPackage && <ErrorMsg text="You must choose package" />}
                {!errorPackage && <ErrorMsg />}

                <div className="input_field" >
                    <label className="classes-picker">
                        Pick start Date:
                    </label>
                    
                    <div id="date-time-wrapper">
                        <DatePicker style={{ "z-index": 100000 }} popperModifiers={{
                            name : "style",
                            options : {"z-index": 100000}

                        }} dateFormat="dd-MM-yyyy" selected={startDate} onChange={(startDate) => {
                            setErrorDate(false)
                            setStartDate(startDate)
                        }
                        } />
                    </div>
                </div>
                <div className="input_field" >
                    <label className="classes-picker">
                        Pick end Date:
                    </label>
                    <div id="date-time-wrapper">
                        <DatePicker lassName="date-picker" dateFormat="dd-MM-yyyy" selected={endDate} onChange={(endDate) => {
                            setErrorDate(false)
                            setEndDate(endDate)
                        }
                        } />
                    </div>
                </div>
                {!errorDate && <Text className="above-payPal" text={" Duration: " + dateDiff + (dateDiff > 1 ? " days." : " day.")} />}
                {errorDate && <ErrorMsg className="above-payPal" text="Start date must to be before end date" />}
                {/*Total price is price for average date in month */}
                {!errorDate && (formState.selectedPackage.price) && <Text className="above-payPal" text={"Total price is " + totalPrice + String.fromCharCode(0x20aa)} />}
                {!errorDate && (formState.selectedPackage.price) && <PayPal totalPrice={totalPrice} onSubmit={onSubmit} />}
                {!(!errorDate && (formState.selectedPackage.price)) && <ErrorMsg className="above-payPal" text="please fill all fields" />}

                {errorMsg && <ErrorMsg text="Something went wrong, please try again" />}
                {!errorMsg && <ErrorMsg />}

            </form>


        </div>
    )
} 

export default PackageSell;

