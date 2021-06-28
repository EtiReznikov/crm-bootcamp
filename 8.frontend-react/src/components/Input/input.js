import React from 'react';
import './Input.scss'
function input(props) {
    return <input
            type={props.type}
            name={props.name}
            className={props.className}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            />
}

export default input;