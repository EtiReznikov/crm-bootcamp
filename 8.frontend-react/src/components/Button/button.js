import React from 'react';

function button(props) {
    return     <button
    type="button"
    className={props.className}
    onClick={props.onClick}>{props.text}</button>
}

export default button;