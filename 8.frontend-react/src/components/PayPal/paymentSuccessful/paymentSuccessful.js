import React from 'react';
import Headline from '../../SubComponents/Headline/Headline';
import './paymentSuccessful.scss'
function paymentSuccessful(props) {
    console.log(props)

    return (
    <div className="form_container" >
        <form>
            <Headline className="head-msg" text="Home page" />
        </form>
    </div>
    )
}


export default paymentSuccessful;