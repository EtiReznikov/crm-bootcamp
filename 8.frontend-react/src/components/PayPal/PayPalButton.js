import React, { useState } from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { PayPalButton } from "react-paypal-button-v2";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPal(props) {

    return (
        <div style={{ position: "relative", "zIndex": 0 }}>
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