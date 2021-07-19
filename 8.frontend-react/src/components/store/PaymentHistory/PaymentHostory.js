import React, { useState } from 'react';
import '../../../Views/Form.scss'
import PackageSell from '../PackageSell/PackageSell';
import AddPersonalTraining from '../PersonalTrainings/AddPersonalTraining/AddPersonalTraining';
import Loader from "react-loader-spinner";
import PaymentSuccessful from '../../PayPal/paymentSuccessful/PaymentSuccessful'
import {
    Redirect
} from "react-router-dom";
function PaymentHistory(props) {
  

    useEffect(() => {
        let data = [];
        (async () => {
            await axios.post('http://localhost:991/clients/getClients/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    if (response.data === "")
                        setData([]);
                    else if (Array.isArray(response.data)) {

                        for (const clientValue of response.data) {
                            let temp = {
                                client_id: clientValue.client_id,
                                client_name:clientValue.client_name,
                                client_name_avatar: <div id="avatar-wrapper">
                                    <Avatar className="avatar" name={clientValue.client_name} src={'http://localhost:8005/uploads/' + clientValue.file} size="60" round={true} />
                                    <div id="name-row">{clientValue.client_name}</div>

                                </div>,
                                gym_id: clientValue.gym_id,
                                client_phone: clientValue.client_phone,
                            }
                            data.push(temp)
                        }
                        setError(false);
                        setData(data);

                    }
                    else {
                        setError(true);
                    }
                })
                .catch(function (error) {
                    setError(true);
                });
        })();
    }, []);

    return (


        <div className="form_wrapper">

            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>

            <div className="form_container">
                <div className="title_container">
                     <h2>{props.clientData.client_name} Payment History</h2>
                </div>
            </div>
        </div>



    );
}



export default PaymentHistory;