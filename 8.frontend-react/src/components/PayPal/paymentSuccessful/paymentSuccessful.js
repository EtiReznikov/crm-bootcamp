import React from 'react';
import Text from '../../SubComponents/Text/Text';
import './paymentSuccessful.scss'
function PaymentSuccessful(props) {
   

    return (
    <div className="form_container" id="success-page">
        <form>
        <i className="fa fa-check-circle" id="payment-success-icon"></i>
            <div  id="payment-success-text">{props.text}</div>
        </form>
    </div>
    )
}


export default PaymentSuccessful;