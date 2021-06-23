import React from 'react';

function input(props) {
    return <input
            type={props.type}
            name={props.name}
            className={props.className}
            placeholder={props.placeholder}
            onChange={props.onChange}
            />
}

export default input;