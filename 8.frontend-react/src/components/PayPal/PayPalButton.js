import React, { useState } from 'react';
import axios from 'axios';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { PayPalButton } from "react-paypal-button-v2";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPal(props) {
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    return (
        <div style={{ position: "relative", "z-index": 0 }}>
             <PayPalButton
                amount={props.totalPrice}
                currency="ILS"
                style={{ 'color': "silver" }}
                onSuccess={(details, data) => {
                    props.onSubmit(details);
                }}
                catchError={() => console.log("error")}
            />
        </div>
    )



}


export default PayPal;