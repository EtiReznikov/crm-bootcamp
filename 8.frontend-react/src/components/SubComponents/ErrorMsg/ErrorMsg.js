import './ErrorMsg.scss'
import React from 'react';

function ErrorMsg(props) {
    return   <div id={props.id} className="error-msg"> {props.text} </div>
}

export default ErrorMsg;