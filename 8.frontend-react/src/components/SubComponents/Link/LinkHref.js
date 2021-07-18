import React from 'react';
import './LinkHref.scss'

function LinkHref(props) {
    return <a
        id={props.id}
        className={props.className}
        href={props.href}
        onClick={props.onClick}>{props.text}
    </a>
}

export default LinkHref;