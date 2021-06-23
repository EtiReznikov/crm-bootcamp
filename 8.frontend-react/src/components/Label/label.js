import React from 'react';

function label(props) {
    return <label htmlFor={props.htmlFor}>{props.text}</label>
}

export default label;