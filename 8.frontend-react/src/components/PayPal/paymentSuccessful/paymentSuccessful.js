import React from 'react';
import Text from '../../SubComponents/Text/Text';
import './paymentSuccessful.scss'
function PaymentSuccessful(props) {
    console.log(props)

    return (
    <div className="form_container" id="success-page">
        <form>
        <i class="fa fa-check-circle" id="payment-success-icon"></i>
            <div  id="payment-success-text">{props.text}</div>
        </form>
    </div>
    )
}


export default PaymentSuccessful;