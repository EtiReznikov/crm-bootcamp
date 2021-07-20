import React, { useState, useEffect } from 'react';
import './AddPersonalCalendar.scss'
import '../../../Views/Form.scss'
import AddPersonalTraining from './AddPersonalTraining/AddPersonalTraining';
import PaymentSuccessful from '../../PayPal/paymentSuccessful/PaymentSuccessful'
import axios from 'axios';
function AddPersonalTrainerFromCalendar(props) {
    const [paymentSuccess, setPaymentSuccess] = useState(0);
    const [clients, setClients] =  useState([]);
    useEffect(() => {
        axios.post('http://localhost:991/clients/getClients/', {
            business_id: localStorage.getItem('business_id'),
        })
            .then((response) => {
                if (response.data === "")
                    setClients([]);
                else if (Array.isArray(response.data)) {
                    let data = [];
                    for (const clientValue of response.data) {
                        data.push({
                            value: clientValue.client_id,
                            label: clientValue.client_name,
                        })
                    }
                    setClients(data);

                }
                else {
                   
                }
            })
            .catch(function (error) {
                
            });
    },[]);

    return (
        <div className="store-wrapper">
            <div className="form_wrapper">
                <button className="exit" onClick={props.closeModal} >
                    <i id="exit-wind" className="fa fa-times"></i>
                </button>
                <h2 id="head-personal-training-calendar">
                    Personal Training
                </h2>
                {paymentSuccess === 0 &&
                    <AddPersonalTraining closeModal={props.closeModal} clientData={props.clientData} changeDataState={props.changeDataState} setPaymentSuccess={setPaymentSuccess} clients={clients} slot={props.slot} fromCalendar={true} />
                }
                {paymentSuccess === 1 && <PaymentSuccessful text="Payment successful" />}
            </div>
        </div>
    );
}



export default AddPersonalTrainerFromCalendar;