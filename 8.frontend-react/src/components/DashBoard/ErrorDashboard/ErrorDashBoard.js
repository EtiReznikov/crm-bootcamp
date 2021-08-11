import './ErrorDashboard.scss'
import React from 'react';

function ErrorDashboard(props) {

    return   <div id={props.id} className="error-comp">
        <i id="msg-comp-icon" className="fa fa-exclamation-triangle"></i>
         <div id="msg-comp-text">{"Something went wrong, please refresh the page."} </div>  
         </div>
}

export default ErrorDashboard;