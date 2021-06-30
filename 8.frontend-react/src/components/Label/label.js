import React from 'react';
import './Label.scss'
function label(props) {
    return <label htmlFor={props.htmlFor}>{props.text}</label>
}

export default label;