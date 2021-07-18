import React, { useState } from 'react';
import './StoreWrapper.scss'
import '../../../Views/Form.scss'
import PackageSell from '../PackageSell/PackageSell';
// import Signup from '../Signup/Signup';
import AddPersonalTraining from '../PersonalTrainings/AddPersonalTraining/AddPersonalTraining';
import Loader from "react-loader-spinner";
import paymentSuccessful from '../../PayPal/paymentSuccessful/paymentSuccessful'
import {
    Redirect
} from "react-router-dom";
function StoreWrapper(props) {
    const [isPackage, setIsPackage] = useState(true);
    const [isPersonalTraining, setIsPersonalTraining] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(0);
    const showPackageBox = () => {
        setIsPackage(true);
        setIsPersonalTraining(false);
    }

    const showPersonalTrainingBox = () => {
        setIsPackage(false);
        setIsPersonalTraining(true);
    }

    return (
        <div className="store-wrapper">

            <div className="form_wrapper">
                {paymentSuccess === 0 && <>
                    <button className="exit" onClick={props.closeModal} >
                        <i id="exit-wind" className="fa fa-times"></i>
                    </button>
                    {
                        (<div className="menu">
                            <div className={"controller" + (isPackage ? "selected-controller" : "")}
                                onClick={showPackageBox.bind(this)} active={isPackage.toString()}>
                                Package
                            </div>

                            <div
                                className={"controller" + (isPersonalTraining ? "selected-controller" : "")}
                                onClick={showPersonalTrainingBox.bind(this)} active={isPersonalTraining.toString()}>
                                Personal Training
                            </div>
                        </div>)}
                    {
                        (isPackage && <PackageSell closeModal={props.closeModal} clientData={props.clientData} changeDataState={props.changeDataState} setPaymentSuccess={setPaymentSuccess} />) ||
                        (isPersonalTraining && <AddPersonalTraining closeModal={props.closeModal} clientData={props.clientData} changeDataState={props.changeDataState} setPaymentSuccess={setPaymentSuccess} />)
                    }
                </>
                }
                {paymentSuccess === 1 && <paymentSuccessful text="test" />}
            </div>


        </div>
    );
}



export default StoreWrapper;